import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { CreateTodoInput } from './dtos/inputs/create-todo.input';
import { TodoService } from './services/todo.service';
import { TodoType } from './types/todo.type';
import { CreateTodoResponse } from './dtos/responses/create-todo.response';
import { UserType } from 'src/user/types/user.type';
import { UserService } from 'src/user/services/user.service';
import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { UserResponseMessage } from 'src/user/messages/user.message';
import { GetTodoResponse } from './dtos/responses/get-todo.response';
import { OffsetPaginationInput } from 'src/common/dtos/inputs/offset-pagination.input';
import { GetTodosResponse } from './dtos/responses/get-todos.response';
import { getTodosByUserId } from './dtos/responses/get-todos-by-id.response';
import { UpdateTodoInput } from './dtos/inputs/update-todo.input';
import { UpdateTodoResponse } from './dtos/responses/update-todo.response';
import { DeleteTodoResponse } from './dtos/responses/delete-todo.response';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.provider';
import { TODO_ADDED, TODO_DELETED } from './channels/todo.channel';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Resolver(() => TodoType)
@UseGuards(JwtAuthGuard)
export class TodoResolver {
  constructor(
    private readonly todoService: TodoService,
    private readonly userService: UserService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @ResolveField(() => UserType, { name: 'user' })
  async user(@Parent() todo: TodoType): Promise<UserType> {
    console.log(`Resolving user field`);
    const resolvedUser: UserType | null =
      await this.userService.getTypedUserById(todo.userId);
    if (!resolvedUser)
      throw new NotFoundException(
        UserResponseMessage.errorMessage.userNotFound,
      );
    return resolvedUser;
  }

  @Query(() => GetTodoResponse)
  async getTodo(@Args('id') id: string): Promise<GetTodoResponse> {
    return this.todoService.getTodoById(id);
  }

  @Query(() => GetTodosResponse)
  getTodos(
    @Args('input', { nullable: true }) input: OffsetPaginationInput,
  ): Promise<GetTodosResponse> {
    return this.todoService.getTodos(input);
  }

  @Mutation(() => UpdateTodoResponse)
  updateTodo(@Args('id') id: string, @Args('input') input: UpdateTodoInput) {
    return this.todoService.updateTodo(id, input);
  }

  @Mutation(() => DeleteTodoResponse)
  deleteTodo(
    @Args('id') id: string,
    @CurrentUser() user: UserType,
  ): Promise<DeleteTodoResponse> {
    return this.todoService.deleteTodo(id,user);
  }

  @Query(() => getTodosByUserId)
  getTodosByUserId(
    @Args('userId') userId: string,
    @Args('input', { nullable: true }) input: OffsetPaginationInput,
  ): Promise<getTodosByUserId> {
    return this.todoService.getTodosByUserId(userId, input);
  }

  @Mutation(() => CreateTodoResponse)
  createTodo(
    @Args('input') input: CreateTodoInput,
    @CurrentUser() user: UserType,
  ): Promise<CreateTodoResponse> {
    return this.todoService.createTodo(input, user);
  }

  @Subscription(() => TodoType, {
    filter: (payload, variables) => {
      return payload.todoAdded.userId === variables.userId;
    },
  })
  todoAdded() {
    return this.pubSub.asyncIterator(TODO_ADDED);
  }

  @Subscription(() => TodoType)
  todoDeleted() {
    return this.pubSub.asyncIterator(TODO_DELETED);
  }
}
