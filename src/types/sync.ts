export type SyncSnapshot<T> = {
  data: T;
  fromCache: boolean;
  hasPendingWrites: boolean;
};