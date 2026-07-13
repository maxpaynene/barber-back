import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Email ya existe' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Iniciar login con Google' })
  googleAuth() {
    return;
  }

  @Post('google')
  @ApiOperation({ summary: 'Login/registro con Google ID token (credential)' })
  @ApiResponse({ status: 200, description: 'Login/registro exitoso, devuelve JWT propio' })
  @ApiResponse({ status: 401, description: 'Token de Google inválido' })
  async googleAuthByToken(@Body() body: { token?: string; credential?: string }) {
    const idToken = body?.token || body?.credential;
    if (!idToken) {
      throw new UnauthorizedException('Falta el token de Google');
    }
    return await this.authService.googleLogin({ idToken });
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback de Google OAuth' })
  async googleAuthRedirect(@Request() req: any) {
    return await this.authService.googleLogin(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verificar si un JWT es válido' })
  @ApiResponse({ status: 200, description: 'Resultado de la verificación' })
  async verify(@Headers('authorization') authorization?: string) {
    if (!authorization) {
      return { valid: false };
    }
    const token = authorization.replace(/^Bearer\s+/i, '').trim();
    if (!token) return { valid: false };
    return await this.authService.verifyToken(token);
  }
}
