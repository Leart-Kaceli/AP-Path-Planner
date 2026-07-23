export type DataServiceResult<T> = {
  data: T;
  error: string | null;
};

export interface DataService<T> {
  loadAll(
    userId?: string | null,
  ): Promise<T[]>;

  saveAll(
    values: T[],
    userId?: string | null,
  ): Promise<void>;
}