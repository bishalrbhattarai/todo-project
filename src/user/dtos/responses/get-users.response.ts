import { ObjectType } from '@nestjs/graphql';
import { createPaginatedResponseType } from 'src/common/dtos/responses/paginated.response';
import { UserType } from 'src/user/types/user.type';

@ObjectType()
export class GetUsersResponse extends createPaginatedResponseType(UserType) {}
