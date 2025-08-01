import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';

import { CreateUserInput } from '../dtos/inputs/create-user.input';
import { UserRepository } from '../repositories/user.repository';
import { UserDocument } from '../schemas/user.schema';
import { convertToGraphQLType } from 'src/common/mappers/generic-type.mapper';
import { UserType } from '../types/user.type';
import { UserResponseMessage } from '../messages/user.message';
import { CreateUserResponse } from '../dtos/responses/create-user.response';
import { OffsetPaginationInput } from 'src/common/dtos/inputs/offset-pagination.input';
import { UpdateUserInput } from '../dtos/inputs/update-user.input';
import { UpdateUserResponse } from '../dtos/responses/update-user.response';
import { TodoService } from 'src/todo/services/todo.service';
import { DeleteUserResponse } from '../dtos/responses/delete-user.response';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => TodoService))
    private readonly todoService: TodoService,
    private readonly userRepository: UserRepository,
  ) {}

  async deleteUser(id: string): Promise<DeleteUserResponse> {
    const foundUser = await this.userRepository.findById(id);
    if (!foundUser) {
      throw new ConflictException(
        UserResponseMessage.errorMessage.userNotFound,
      );
    }
    const deletedUser: UserDocument | null =
      await this.userRepository.deleteById(id);
    if (!deletedUser) {
      throw new ConflictException(
        UserResponseMessage.errorMessage.userDeletionFailed,
      );
    }
    await this.todoService.deleteTodosByUserId(id);
    return {
      message: UserResponseMessage.successMessage.userDeleted,
      data: convertToGraphQLType<UserType>(deletedUser, UserType),
    };
  }
  async updateUser(
    id: string,
    input: UpdateUserInput,
  ): Promise<UpdateUserResponse> {
    const updatedUser: UserDocument | null =
      await this.userRepository.updateById(id, input);
    if (!updatedUser) {
      throw new ConflictException(
        UserResponseMessage.errorMessage.userNotUpdated,
      );
    }
    const userType: UserType = convertToGraphQLType<UserType>(
      updatedUser,
      UserType,
    );
    return {
      message: UserResponseMessage.successMessage.userUpdated,
      data: userType,
    };
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id);
  }

  async getTypedUserById(id: string): Promise<UserType | null> {
    const userDocument: UserDocument | null =
      await this.userRepository.findById(id);
    if (!userDocument) return null;
    return convertToGraphQLType<UserType>(userDocument, UserType);
  }

  async getUsers(input: OffsetPaginationInput) {
    const { data, meta } = await this.userRepository.findPaginated({}, input);
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
