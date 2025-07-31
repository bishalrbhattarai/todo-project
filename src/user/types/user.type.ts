import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class UserType {
  @Field(() => ID)
  @Expose()
  id: string;

  @Field()
  @Expose()
  name: string;

  @Field()
  @Expose()
  email: string;

  @Field({ nullable: true })
  @Expose()
  createdAt?: Date;

  @Field({ nullable: true })
  @Expose()
  updatedAt?: Date;
}
