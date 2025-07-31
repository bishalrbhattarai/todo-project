import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from 'src/common/database/repositories/database.repository';
import { User, UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class UserRepository extends DatabaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
