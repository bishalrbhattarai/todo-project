import { Document, FilterQuery, Model, MongooseOptions, ProjectionFields } from 'mongoose';
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

  create(data: Partial<T>): Promise<T> {
    return this.Tmodel.create(data);
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
