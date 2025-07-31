import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TodoStatusEnum } from '../enums/todo-status.enum';

@ObjectType()
export class TodoType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => TodoStatusEnum)
  status: TodoStatusEnum;

  @Field(() => String)
  userId: string;
}
