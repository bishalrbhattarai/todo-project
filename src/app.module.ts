import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CommonModule, UserModule, GraphqlModule],
})
export class AppModule {}
