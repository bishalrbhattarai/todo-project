import { Args, ArgsType, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserType } from './types/user.type';
import { CreateUserInput } from './dtos/inputs/create-user.input';
import { UserService } from './services/user.service';
import { CreateUserResponse } from './dtos/responses/create-user.response';
import { OffsetPaginationInput } from 'src/common/dtos/inputs/offset-pagination.input';
import { GetUsersResponse } from './dtos/responses/get-users.response';
import { UpdateUserInput } from './dtos/inputs/update-user.input';
import { UpdateUserResponse } from './dtos/responses/update-user.response';
import { DeleteUserResponse } from './dtos/responses/delete-user.response';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateUserResponse)
  createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<CreateUserResponse> {
    return this.userService.createUser(input);
  }

  @Mutation(() => DeleteUserResponse)
  deleteUser(@Args('id') id: string): Promise<DeleteUserResponse> {
    return this.userService.deleteUser(id);
  }

  @Mutation(() => UpdateUserResponse)
  updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UpdateUserResponse> {
    return this.userService.updateUser(id, input);
  }

  @Query(() => GetUsersResponse)
  getUsers(@Args('input', { nullable: true }) input: OffsetPaginationInput) {
    return this.userService.getUsers(input);
  }
}
