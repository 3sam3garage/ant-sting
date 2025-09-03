import { PortfolioItem } from '@libs/infrastructure/mongo';

export class StockInventory {
  // 투자한 회사명
  nameOfIssuer: string;
  titleOfClass: string;
  // Committee on Uniform Securities Identification Procedures 번호. 북미에서 발행된 증권을 식별하는 9자리 영숫자 코드.
  cusip: string;
  value: string;
  shrsOrPrnAmt: {
    sshPrnamt: string;
    sshPrnamtType: string;
  };
  investmentDiscretion: string;
  votingAuthority: {
    Sole: string;
    Shared: string;
    None: string;
  };

  toPortfolioItem(
    date: string,
    totalValue: number,
    inventory: StockInventory,
  ): PortfolioItem {
    const { cusip, value, nameOfIssuer, shrsOrPrnAmt } = inventory;
    const portion = (+value / totalValue) * 100;

    return {
      shareAmount: +shrsOrPrnAmt.sshPrnamt,
      date,
      name: nameOfIssuer,
      cusip,
      value: +value,
      portion: parseFloat(portion.toFixed(3)),
    };
  }
}
