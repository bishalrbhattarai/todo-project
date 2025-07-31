import { ConflictException, Injectable } from '@nestjs/common';

import { CreateUserInput } from '../dtos/inputs/create-user.input';
import { UserRepository } from '../repositories/user.repository';
import { UserDocument } from '../schemas/user.schema';
import { convertToGraphQLType } from 'src/common/mappers/generic-type.mapper';
import { UserType } from '../types/user.type';
import { UserResponseMessage } from '../messages/user.message';
import { CreateUserResponse } from '../dtos/responses/create-user.response';
import { OffsetPaginationInput } from 'src/common/dtos/inputs/offset-pagination.input';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(input: OffsetPaginationInput) {
    const { data, meta } = await this.userRepository.findPaginated({}, input);
    console.log(data);
    const users: UserType[] = data.map((user: UserDocument) =>
      convertToGraphQLType<UserType>(user, UserType),
    );
    return {
      message: UserResponseMessage.successMessage.usersFetched,
      data: users,
      meta,
    };
  }

  async createUser(input: CreateUserInput): Promise<CreateUserResponse> {
    const emailExists: UserDocument | null =
      await this.userRepository.findByEmail(input.email);
    if (emailExists)
      throw new ConflictException(
        UserResponseMessage.errorMessage.emailAlreadyRegistered,
      );
    const createdUserDocument: UserDocument =
      await this.userRepository.create(input);
    const userType: UserType = convertToGraphQLType<UserType>(
      createdUserDocument,
      UserType,
    );
    return {
      message: UserResponseMessage.successMessage.userCreated,
      data: userType,
    };
  }
}
