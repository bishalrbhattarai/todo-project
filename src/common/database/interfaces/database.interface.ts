import { FilterQuery, MongooseOptions } from 'mongoose';

export interface IMetaData {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IMetaData;
}

export interface IDatabaseInterface<T> {
  create(data: Partial<T>): Promise<T>;
  findByEmail(email: string): Promise<T | null>;
  findPaginated(
    filter?: FilterQuery<T>,
    pagination?: { page?: number; limit?: number },
    projection?: Record<string, any>,
    options?: MongooseOptions,
  ): Promise<IPaginatedResponse<T>>;
  findById(id: string): Promise<T | null>;
  updateById(
    id: string,
    input: Record<string, any>,
    options?: Record<string, any>,
  ): Promise<T | null>;
}
