import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function createResponseType<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class GenericResponse {
    @Field(() => String)
    message: string;

    @Field(() => classRef)
    data: T;
  }

  return GenericResponse;
}
