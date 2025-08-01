import { ObjectType } from '@nestjs/graphql';
import { createResponseType } from 'src/common/dtos/responses/generic.response';
import { UserType } from 'src/user/types/user.type';

@ObjectType()
export class UpdateUserResponse extends createResponseType(UserType) {}
