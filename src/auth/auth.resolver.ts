import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/user/dtos/inputs/create-user.input';
import { AuthService } from './auth.service';
import { CreateUserResponse } from 'src/user/dtos/responses/create-user.response';
import { UseGuards } from '@nestjs/common';
import { UserType } from 'src/user/types/user.type';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => CreateUserResponse)
  async register(
    @Args('input') input: CreateUserInput,
  ): Promise<CreateUserResponse> {
    return this.authService.register(input);
  }

  @Mutation(() => UserType)
  @UseGuards(LocalAuthGuard)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context,
  ) {
    context.req.body = { email, password };
    console.log('Login attempt with email:', email);
    return context.req.user;
  }
}
