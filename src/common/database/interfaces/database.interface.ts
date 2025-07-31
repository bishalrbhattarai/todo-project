export interface IDatabaseInterface<T> {
  create(data: Partial<T>): Promise<T>;
}
