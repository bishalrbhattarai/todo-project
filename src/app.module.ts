import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AppResolver } from './app.resolver';
import { TodoModule } from './todo/todo.module';
import { PubSubModule } from './pubsub/pubsub.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    GraphqlModule,
    TodoModule,
    PubSubModule,
    AuthModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
