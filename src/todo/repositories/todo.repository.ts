import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from 'src/common/database/repositories/database.repository';
import { Todo, TodoDocument } from '../schemas/todo.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TodoRepository extends DatabaseRepository<TodoDocument> {
  constructor(@InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>) {
    super(todoModel);
  }
}
