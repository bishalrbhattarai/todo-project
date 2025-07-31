import { Document, Model } from 'mongoose';
import { IDatabaseInterface } from '../interfaces/database.interface';

export abstract class DatabaseRepository<T extends Document> implements IDatabaseInterface<T>
{
  constructor(protected readonly Tmodel: Model<T>) {}

  create(data: Partial<T>): Promise<T> {
    return this.Tmodel.create(data);
  }
}
