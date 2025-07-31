import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(4, { message: 'Name must be at least 5 characters long' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MinLength(4, { message: 'Email must be at least 5 characters long' })
  email: string;
}
