import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private static readonly logger = new Logger(GoogleStrategy.name);
  static enabled = false;

  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    GoogleStrategy.enabled = Boolean(clientID && clientSecret && callbackURL);

    super({
      clientID: clientID || 'disabled',
      clientSecret: clientSecret || 'disabled',
      callbackURL: callbackURL || 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: false,
    });

    if (!GoogleStrategy.enabled) {
      GoogleStrategy.logger.warn(
        'Google OAuth redirect flow disabled: faltan GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET o GOOGLE_CALLBACK_URL.',
      );
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      googleId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      avatar: photos[0].value,
    };

    done(null, user);
  }
}