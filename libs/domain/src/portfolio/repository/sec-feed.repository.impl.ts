export interface SecFeedRepositoryImpl {
  addToSet(url: string): Promise<void>;
  exists(url: string): Promise<boolean>;
}
