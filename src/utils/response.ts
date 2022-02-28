import type { Stock as IStock } from "@prisma/client";

namespace IDailySummary {
  export interface WinnersAndLosers {
    winners: Stock[];
    losers: Stock[];
  }
}

const indexed = <T extends IStock>(list: T[]) => {
  const map: { [key: string]: T } = {};

  for (const item of list) {
    map[item.ticker] = item;
  }

  return map;
};

export const generateDailySummaryFor = (
  stocks: Stock[]
): IDailySummary.WinnersAndLosers => {
  const winners = [];
  const losers = [];

  for (const stock of stocks) {
    if (stock.n > 100_000) {
      const change = ((stock.c - stock.o) / stock.o) * 100;

      if (change > 0) {
        winners.push({ ...stock, change });
      }

      if (change < 0) {
        losers.push({ ...stock, change });
      }
    }
  }

  return {
    winners: winners.sort((a, b) => b.change - a.change).slice(0, 3),
    losers: losers.sort((a, b) => a.change - b.change).slice(0, 3),
  };
};

export async function generateResponse(
  summary: IDailySummary.WinnersAndLosers,
  tickers: IStock[]
) {
  return {
    summary,
    tickers: indexed<IStock>(tickers),
  };
}
