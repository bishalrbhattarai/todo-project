import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PaginationMeta } from './paginated-meta.response';

export function createPaginatedResponseType<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponse {
    @Field(() => [classRef])
    data: T[];

    @Field(() => PaginationMeta)
    meta: PaginationMeta;
  }

  return PaginatedResponse;
}
