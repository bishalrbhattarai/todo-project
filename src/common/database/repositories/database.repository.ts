import {
  Document,
  FilterQuery,
  Model,
  MongooseOptions,
  ProjectionFields,
  UpdateQuery,
} from 'mongoose';
import {
  IDatabaseInterface,
  IPaginatedResponse,
} from '../interfaces/database.interface';
import { OffsetPaginationInput } from 'src/common/dtos/inputs/offset-pagination.input';

export abstract class DatabaseRepository<T extends Document>
  implements IDatabaseInterface<T>
{
  constructor(protected readonly Tmodel: Model<T>) {}
  findByEmail(email: string): Promise<T | null> {
    return this.Tmodel.findOne({ email }).exec();
  }

  findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.Tmodel.findOne(filter).exec();
  }

  deleteOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.Tmodel.findOneAndDelete(filter, { new: true }).exec();
  }

  updateById(
    id: string,
    input: UpdateQuery<T>,
    options: Record<string, any> = { new: true },
  ) {
    return this.Tmodel.findByIdAndUpdate(id, input, options).exec();
  }

  create(data: Partial<T>): Promise<T> {
    return this.Tmodel.create(data);
  }

  findById(id: string): Promise<T | null> {
    return this.Tmodel.findById(id).exec();
  }

  deleteById(id: string): Promise<T | null> {
    return this.Tmodel.findByIdAndDelete(id).exec();
  }

  async findPaginated(
    filter: FilterQuery<T> = {},
    pagination: OffsetPaginationInput,
    projection?: ProjectionFields<T>,
    options?: MongooseOptions,
  ): Promise<IPaginatedResponse<T>> {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const query = this.Tmodel.find(filter, projection, options)
      .skip(offset)
      .limit(limit);
    const data = await query.exec();
    const totalItems = await this.Tmodel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        totalItems,
        page,
        limit,
        totalPages,
      },
    };
  }
}
