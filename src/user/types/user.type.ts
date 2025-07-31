import { ObjectType, Field } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class UserType {
  @Field()
  @Expose()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
