import { Portfolio } from '../portfolio.entity';

export interface PortfolioRepositoryImpl {
  findOneByUrl(url: string): Promise<Portfolio>;

  save(domain: Portfolio): Promise<Portfolio>;

  findOneById(id: unknown): Promise<Portfolio>;

  findOnePreviousByIdAndIssuer(id: unknown, issuer: string): Promise<Portfolio>;
}
