import { Injectable } from '@nestjs/common';
import {
  BOND_COUNTRIES,
  BondYieldRepository,
  EconomicInformationAnalysisRepository,
  ExchangeRateRepository,
  FinancialStatementRepository,
  INTEREST_TYPE,
  InterestRateRepository,
  StockAnalysisRepository,
  StockReportRepository,
} from '@libs/domain';
import { ClaudeService } from '@libs/ai';
import { TEST_INTEREST_PROMPT } from '@libs/ai/constants/test';

@Injectable()
export class MacroAnalysisDraft {
  constructor(
    private readonly stockReportRepo: StockReportRepository,
    private readonly stockAnalysisRepo: StockAnalysisRepository,
    private readonly financialStatementRepo: FinancialStatementRepository,
    private readonly economicInfoAnalysisRepo: EconomicInformationAnalysisRepository,
    private readonly interestRateRepo: InterestRateRepository,
    private readonly exchangeRateRepo: ExchangeRateRepository,
    private readonly bondYieldRepo: BondYieldRepository,
    private readonly claudeService: ClaudeService,
  ) {}

  async exec(): Promise<void> {
    const query = { date: { $gte: '2023-12-01', $lte: '2025-01-31' } };

    const [baseInterests, policyInterests, bondYields] = await Promise.all([
      this.interestRateRepo.find({
        where: { type: INTEREST_TYPE.BASE, ...query },
        select: ['date', 'interestRate', 'country'],
      }),
      this.interestRateRepo.find({
        where: { type: INTEREST_TYPE.POLICY, ...query },
        select: ['date', 'interestRate', 'country'],
      }),
      this.bondYieldRepo.find({
        where: {
          ...query,
          country: {
            $in: [BOND_COUNTRIES.USA, BOND_COUNTRIES.KOR, BOND_COUNTRIES.JPN],
          },
        },
        select: ['date', 'country', 'interestRate', 'country'],
      }),
    ]);

    const removeIds = (items) => {
      return items.map(({ _id, ...rest }) => {
        return rest;
      });
    };

    const prompt = TEST_INTEREST_PROMPT.replace(
      '{{BASE_INTEREST_RATE}}',
      JSON.stringify(removeIds(baseInterests)),
    )
      .replace(
        '{{POLICY_INTEREST_RATE}}',
        JSON.stringify(removeIds(policyInterests)),
      )
      .replace('{{BOND_YIELD}}', JSON.stringify(removeIds(bondYields)));

    const res = await this.claudeService.invoke(prompt);
    console.log(res);
  }
}
