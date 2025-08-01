import { ObjectType } from '@nestjs/graphql';
import { createPaginatedResponseType } from 'src/common/dtos/responses/paginated.response';
import { TodoType } from 'src/todo/types/todo.type';

@ObjectType()
export class GetTodosResponse extends createPaginatedResponseType(TodoType) {}
