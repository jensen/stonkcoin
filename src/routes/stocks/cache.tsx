import type { ActionFunction } from "remix";
import { db } from "~/services/db.server";
import { now } from "~/utils/date";

import { getDaily } from "~/api/polygon";

import { generateDailySummaryFor, generateResponse } from "~/utils/response";
import { getTickers } from "~/utils/tickers";

function pad(value: string) {
  if (Number(value) < 10) {
    return `0${value}`;
  }

  return value;
}

export const action: ActionFunction = async () => {
  const cache = await db.cache.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  const { createdAt } = cache || { createdAt: null };

  const expired = createdAt
    ? new Date().getTime() - new Date(createdAt).getTime() > 60 * 1_000
    : true;

  if (expired) {
    const current = now();
    const today = `${current.year}-${pad(current.month)}-${pad(current.day)}`;
    const stocks = await getDaily(today);

    if (stocks.count > 0) {
      await db.cache.create({
        data: {
          body: stocks.results,
        },
      });

      const summary = generateDailySummaryFor(stocks.results);

      const symbols = summary.winners.concat(summary.losers);
      const tickers = await getTickers(db, symbols);

      return {
        ...generateResponse(summary, tickers),
        updated: true,
      };
    }
  }

  return {
    updated: false,
  };
};
