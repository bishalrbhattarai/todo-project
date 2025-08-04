import { ConflictException, Injectable } from '@nestjs/common';
import { convertToGraphQLType } from 'src/common/mappers/generic-type.mapper';
import { CreateUserInput } from 'src/user/dtos/inputs/create-user.input';
import { CreateUserResponse } from 'src/user/dtos/responses/create-user.response';
import { UserService } from 'src/user/services/user.service';
import { UserType } from 'src/user/types/user.type';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(input: CreateUserInput): Promise<CreateUserResponse> {
    return this.userService.createUser(input);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserType | null> {
    const user = await this.userService.findByEmail(email);
    if (!user || user.password !== password) {
      return null;
    }
    return convertToGraphQLType<UserType>(user, UserType);
  }
}
