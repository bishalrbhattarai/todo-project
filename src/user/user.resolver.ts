import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserType } from './types/user.type';
import { CreateUserInput } from './dtos/inputs/create-user.input';
import { UserService } from './services/user.service';
import { CreateUserResponse } from './dtos/responses/create-user.response';
import { OffsetPaginationInput } from 'src/common/dtos/inputs/offset-pagination.input';
import { GetUsersResponse } from './dtos/responses/get-users.response';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateUserResponse)
  createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<CreateUserResponse> {
    return this.userService.createUser(input);
  }

  @Query(()=>GetUsersResponse)
  getUsers(@Args('input',{nullable:true}) input: OffsetPaginationInput) {
    return this.userService.getUsers(input);
  }
}
