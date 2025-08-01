import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { DatabaseModule } from 'src/common/database/database.module';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { TodoModule } from 'src/todo/todo.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => TodoModule),
    DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserResolver, UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
