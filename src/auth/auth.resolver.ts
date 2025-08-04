import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/user/dtos/inputs/create-user.input';
import { AuthService } from './auth.service';
import { CreateUserResponse } from 'src/user/dtos/responses/create-user.response';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GqlContext } from 'src/graphql/graphql.module';
import { LoginResponse } from './dtos/responses/login.response';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => CreateUserResponse)
  async register(
    @Args('input') input: CreateUserInput,
  ): Promise<CreateUserResponse> {
    return this.authService.register(input);
  }

  @Mutation(() => LoginResponse)
  @UseGuards(LocalAuthGuard)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: GqlContext,
  ) {
    return this.authService.login(context.req.user);
  }

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  me(@Context() context: GqlContext){
    console.log(`THe CUrrently Logged in user inside the me query`)
    console.log(context.req.user)
    return 'Still left to implement this query';
  }
}
