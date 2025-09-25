export abstract class BaseRepository<T, U> {
  protected abstract toDomain(persistence: T): U;
  protected abstract toPersistence(domain: U): T;
}
