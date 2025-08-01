import { ObjectType } from '@nestjs/graphql';
import { createResponseType } from 'src/common/dtos/responses/generic.response';
import { TodoType } from 'src/todo/types/todo.type';

@ObjectType()
export class DeleteTodoResponse extends createResponseType(TodoType) {}
