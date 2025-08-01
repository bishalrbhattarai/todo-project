import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TodoStatusEnum } from 'src/todo/enums/todo-status.enum';

@InputType()
export class UpdateTodoInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field(() => TodoStatusEnum, { nullable: true })
  @IsOptional()
  @IsEnum(TodoStatusEnum)
  status?: TodoStatusEnum;
}
