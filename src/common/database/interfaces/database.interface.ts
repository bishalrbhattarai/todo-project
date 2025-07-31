import { MongooseOptions } from 'mongoose';

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
    filter?: Record<string, any>,
    pagination?: { page?: number; limit?: number },
    projection?: Record<string, any>,
    options?: MongooseOptions,
  ): Promise<IPaginatedResponse<T>>;
}
