import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  message: string;

  @Field(() => String)
  accessToken: string;
}
