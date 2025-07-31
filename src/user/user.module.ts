import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { DatabaseModule } from 'src/common/database/database.module';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserResolver, UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
