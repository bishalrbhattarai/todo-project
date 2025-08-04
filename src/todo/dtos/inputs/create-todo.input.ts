import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { TodoStatusEnum } from 'src/todo/enums/todo-status.enum';

@InputType()
export class CreateTodoInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  title: string;

  @Field(() => TodoStatusEnum)
  @IsNotEmpty()
  @IsEnum(TodoStatusEnum)
  status: TodoStatusEnum;

}
