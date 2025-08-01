import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TodoStatusEnum } from '../enums/todo-status.enum';
import { UserType } from 'src/user/types/user.type';
import { Expose } from 'class-transformer';

@ObjectType()
export class TodoType {
  @Field(() => ID)
  @Expose()
  id: string;

  @Field()
  @Expose()
  title: string;

  @Field(() => TodoStatusEnum)
  @Expose()
  status: TodoStatusEnum;

  @Field(() => String)
  @Expose()
  userId: string;

  @Field(() => UserType)
  @Expose()
  user: UserType;
}
