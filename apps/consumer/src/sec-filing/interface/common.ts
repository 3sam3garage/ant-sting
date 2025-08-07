export interface InvestmentItem {
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
}

export interface InvestmentInfo {
    items: InvestmentItem[];
    url: string;
    date: string;
}

export interface PortfolioItem {
    name: string;
    cusip: string;
    date: string;

    // 보유 주식수
    shareAmount: number;
    // USD
    value: number;
    portion: number;
}

export interface Portfolio {
    url: string;
    date: string;
    totalValue: number;
    items: PortfolioItem[];
}
