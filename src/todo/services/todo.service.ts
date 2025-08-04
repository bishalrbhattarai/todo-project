import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodoRepository } from '../repositories/todo.repository';
import { CreateTodoInput } from '../dtos/inputs/create-todo.input';
import { UserService } from 'src/user/services/user.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { UserResponseMessage } from 'src/user/messages/user.message';
import { TodoDocument } from '../schemas/todo.schema';
import { convertToGraphQLType } from 'src/common/mappers/generic-type.mapper';
import { TodoType } from '../types/todo.type';
import { CreateTodoResponse } from '../dtos/responses/create-todo.response';
import { TodoResponseMessage } from '../messages/todo.message';
import { GetTodoResponse } from '../dtos/responses/get-todo.response';
import { GetTodosResponse } from '../dtos/responses/get-todos.response';
import { OffsetPaginationInput } from 'src/common/dtos/inputs/offset-pagination.input';
import { getTodosByUserId } from '../dtos/responses/get-todos-by-id.response';
import { UpdateTodoInput } from '../dtos/inputs/update-todo.input';
import { UpdateTodoResponse } from '../dtos/responses/update-todo.response';
import { DeleteTodoResponse } from '../dtos/responses/delete-todo.response';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pubsub/pubsub.provider';
import { TODO_ADDED, TODO_DELETED } from '../channels/todo.channel';
import { UserType } from 'src/user/types/user.type';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  async deleteTodosByUserId(id: string) {
    return this.todoRepository.deleteOne({ userId: id });
  }

  async deleteTodo(id: string, user: UserType): Promise<DeleteTodoResponse> {
    
    const foundTodo: TodoDocument | null = await this.todoRepository.findOne({
      _id: id,
      userId: user.id,
    });

    if (!foundTodo) {
      throw new NotFoundException(
        TodoResponseMessage.errorMessage.todoNotFound,
      );
    }

    if (foundTodo.userId !== user.id) {
      throw new NotFoundException(
        TodoResponseMessage.errorMessage.notAuthorizedToDeleteTodo,
      );
    }

    const deletedTodo: TodoDocument | null =
      await this.todoRepository.deleteById(id);
    if (!deletedTodo)
      throw new NotFoundException(
        TodoResponseMessage.errorMessage.todoNotFound,
      );
    const mappedTodoType: TodoType = convertToGraphQLType<TodoType>(
      deletedTodo,
      TodoType,
    );

    await this.pubSub.publish(TODO_DELETED, {
      todoDeleted: mappedTodoType,
    });

    return {
      message: TodoResponseMessage.successMessage.todoDeleted,
      data: mappedTodoType,
    };
  }

  async updateTodo(
    id: string,
    input: UpdateTodoInput,
  ): Promise<UpdateTodoResponse> {
    const todoExists: TodoDocument | null =
      await this.todoRepository.findById(id);
    if (!todoExists)
      throw new NotFoundException(
        TodoResponseMessage.errorMessage.todoNotFound,
      );

    const updatedTodo: TodoDocument | null =
      await this.todoRepository.updateById(id, input);
    if (!updatedTodo)
      throw new NotFoundException(
        TodoResponseMessage.errorMessage.todoNotFound,
      );
    const mappedTodoType: TodoType = convertToGraphQLType<TodoType>(
      updatedTodo,
      TodoType,
    );
    return {
      message: TodoResponseMessage.successMessage.todoUpdated,
      data: mappedTodoType,
    };
  }

  async getTodosByUserId(
    userId: string,
    input: OffsetPaginationInput,
  ): Promise<getTodosByUserId> {
    const userExists: UserDocument | null =
      await this.userService.getUserById(userId);
    if (!userExists)
      throw new NotFoundException(
        UserResponseMessage.errorMessage.userNotFound,
      );

    const { data, meta } = await this.todoRepository.findPaginated(
      { userId },
      input,
    );

    const todos: TodoType[] = data.map((todo: TodoDocument) =>
      convertToGraphQLType<TodoType>(todo, TodoType),
    );
    return {
      data: todos,
      meta,
    };
  }

  async getTodos(pagination: {
    page: number;
    limit: number;
  }): Promise<GetTodosResponse> {
    const { data, meta } = await this.todoRepository.findPaginated(
      {},
      pagination,
    );

    const todos: TodoType[] = data.map((todo: TodoDocument) =>
      convertToGraphQLType<TodoType>(todo, TodoType),
    );
    return {
      data: todos,
      meta,
    };
  }

  async createTodo(
    input: CreateTodoInput,
    user: UserType,
  ): Promise<CreateTodoResponse> {
    console.log('yo chai custom decorator bata ako user ho hai');
    console.log(user);
    const userExists: UserDocument | null = await this.userService.getUserById(
      user.id,
    );
    console.log('the user exists logging');
    console.log(userExists);

    if (!userExists) {
      console.log('inside the !userExists condition');
      throw new NotFoundException(
        UserResponseMessage.errorMessage.userNotFound,
      );
    }
    const TodoDocument: TodoDocument = await this.todoRepository.create({
      ...input,
      userId: user.id,
    });
    const mappedTodoType = convertToGraphQLType<TodoType>(
      TodoDocument,
      TodoType,
    );

    await this.pubSub.publish(TODO_ADDED, {
      todoAdded: mappedTodoType,
    });

    console.log(mappedTodoType);
    return {
      message: TodoResponseMessage.successMessage.todoCreated,
      data: mappedTodoType,
    };
  }

  async getTodoById(id: string): Promise<GetTodoResponse> {
    const foundTodo: TodoDocument | null =
      await this.todoRepository.findById(id);
    if (!foundTodo)
      throw new NotFoundException(
        TodoResponseMessage.errorMessage.todoNotFound,
      );
    const mappedTodoType: TodoType = convertToGraphQLType<TodoType>(
      foundTodo,
      TodoType,
    );
    return {
      message: TodoResponseMessage.errorMessage.todoNotFound,
      data: mappedTodoType,
    };
  }
}
