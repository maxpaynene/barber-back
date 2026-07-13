import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GOOGLE_OAUTH_CLIENT } from './google-oauth.tokens';
import { ROLE } from '../common/roles.constants';

type UserRole = 'admin' | 'barber' | 'user';

const ROLE_NAMES: Record<number, UserRole> = {
  [ROLE.ADMIN]: 'admin',
  [ROLE.BARBER]: 'barber',
};

const resolveRole = (user: User): UserRole => {
  const roleName = (user as any).rol?.name?.toString().toLowerCase().trim();
  if (roleName === 'admin' || roleName === 'administrator') return 'admin';
  if (roleName === 'barber' || roleName === 'barbero') return 'barber';
  if (ROLE_NAMES[user.rol_id]) return ROLE_NAMES[user.rol_id];
  return 'user';
};

const sanitizeUser = (user: User) => {
  const { password: _password, rol, ...rest } = user as any;
  return {
    ...rest,
    role: resolveRole(user),
  };
};

interface GoogleProfilePayload {
  googleId: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(GOOGLE_OAUTH_CLIENT)
    private googleClient: OAuth2Client,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
      relations: ['rol'],
    });

    if (existingUser) {
      throw new UnauthorizedException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      rol_id: registerDto.rolId || ROLE.CLIENT,
      avatar: registerDto.avatar || null,
    });

    const saved = await this.userRepository.save(newUser);
    const userWithRol = await this.userRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ['rol'],
    });

    const token = this.generateToken(userWithRol);

    return {
      user: sanitizeUser(userWithRol),
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email, active: true },
      relations: ['rol'],
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(user);

    return {
      user: sanitizeUser(user),
      access_token: token,
    };
  }

  async verifyGoogleIdToken(idToken: string): Promise<GoogleProfilePayload> {
    if (!idToken || typeof idToken !== 'string') {
      throw new UnauthorizedException('Token de Google inválido');
    }

    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      throw new UnauthorizedException(
        'Google OAuth no está configurado en el servidor',
      );
    }

    let ticket: LoginTicket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: clientId,
      });
    } catch (err) {
      throw new UnauthorizedException('Token de Google inválido o expirado');
    }

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Token de Google sin datos suficientes');
    }

    const fullName = [payload.given_name, payload.family_name]
      .filter(Boolean)
      .join(' ')
      .trim();

    return {
      googleId: payload.sub,
      email: payload.email,
      name: fullName || payload.name || null,
      avatar: payload.picture || null,
    };
  }

  async googleLogin(input: { idToken?: string } & Partial<GoogleProfilePayload>) {
    let profile: GoogleProfilePayload;

    if (input.idToken) {
      profile = await this.verifyGoogleIdToken(input.idToken);
    } else if (input.googleId && input.email) {
      profile = {
        googleId: input.googleId,
        email: input.email,
        name: input.name ?? null,
        avatar: input.avatar ?? null,
      };
    } else {
      throw new UnauthorizedException('Faltan datos de Google');
    }

    let user = await this.userRepository.findOne({
      where: [{ google_id: profile.googleId }, { email: profile.email }],
      relations: ['rol'],
    });

    if (user) {
      // Vinculación silenciosa si faltaba google_id
      if (!user.google_id) {
        user.google_id = profile.googleId;
      }
      if (!user.avatar && profile.avatar) {
        user.avatar = profile.avatar;
      }
      if (!user.name && profile.name) {
        user.name = profile.name;
      }
      if (user.google_id !== profile.googleId || (profile.avatar && user.avatar !== profile.avatar)) {
        await this.userRepository.save(user);
        user = await this.userRepository.findOneOrFail({
          where: { id: user.id },
          relations: ['rol'],
        });
      }
    } else {
      const created = this.userRepository.create({
        google_id: profile.googleId,
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        avatar: profile.avatar || null,
        rol_id: ROLE.CLIENT,
      });
      await this.userRepository.save(created);
      user = await this.userRepository.findOneOrFail({
        where: { id: created.id },
        relations: ['rol'],
      });
    }

    const token = this.generateToken(user);

    return {
      user: sanitizeUser(user),
      access_token: token,
    };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      rolId: user.rol_id,
    };

    return this.jwtService.sign(payload);
  }

  async validateUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, active: true },
      relations: ['rol'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    return sanitizeUser(user);
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify<{ sub: number }>(token);
      if (!payload?.sub) {
        return { valid: false };
      }
      const user = await this.userRepository.findOne({
        where: { id: payload.sub, active: true },
        relations: ['rol'],
      });
      if (!user) return { valid: false };
      return {
        valid: true,
        user: sanitizeUser(user),
      };
    } catch {
      return { valid: false };
    }
  }
}