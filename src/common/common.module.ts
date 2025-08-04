import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      global: true,
      signOptions: {
        expiresIn: '12h',
      },
    }),
    DatabaseModule,
  ],
})
export class CommonModule {}
