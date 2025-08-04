import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { convertToGraphQLType } from 'src/common/mappers/generic-type.mapper';
import { CreateUserInput } from 'src/user/dtos/inputs/create-user.input';
import { CreateUserResponse } from 'src/user/dtos/responses/create-user.response';
import { UserService } from 'src/user/services/user.service';
import { UserType } from 'src/user/types/user.type';
import { LoginResponse } from './dtos/responses/login.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(input: CreateUserInput): Promise<CreateUserResponse> {
    return this.userService.createUser(input);
  }

  async login(user: UserType): Promise<LoginResponse> {
    const payload = { email: user.email, id: user.id };
    const accessToken = this.jwtService.sign(payload);
    return {
      message: 'Login successful',
      accessToken,
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserType | null> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.password || user.password !== password) {
      return null;
    }
    return convertToGraphQLType<UserType>(user, UserType);
  }
}
