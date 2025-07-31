import { Args, Resolver } from '@nestjs/graphql';
import { UserType } from './types/user.type';
import { CreateUserInput } from './dtos/inputs/create-user.input';

@Resolver(() => UserType)
export class UserResolver {
  createUser(@Args('input') input: CreateUserInput) {
    
  }
}
