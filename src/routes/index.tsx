import type { LoaderFunction } from "remix";
import type { Stock as IStock } from "@prisma/client";

import { useCatch, useLoaderData } from "remix";
import { db } from "~/services/db.server";

import List from "~/components/List";

import { generateDailySummaryFor, generateResponse } from "~/utils/response";
import { getTickers } from "~/utils/tickers";

import useRefreshCache from "~/hooks/use-refresh-cache";

export let loader: LoaderFunction = async () => {
  const cache = await db.cache.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (cache === null) {
    throw new Response("No records in Cache table.", { status: 404 });
  }

  const summary = generateDailySummaryFor(cache.body as unknown as Stock[]);
  const tickers = await getTickers(db, summary.winners.concat(summary.losers));

  return generateResponse(summary, tickers);
};

type LoaderData = {
  summary: { winners: Stock[]; losers: Stock[] };
  tickers: { [key: string]: IStock };
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  useRefreshCache();

  const combine = (stock: Stock) => ({
    ...stock,
    ...data.tickers[stock.T],
  });

  const winners = data.summary?.winners
    ? data.summary.winners.map(combine)
    : [];
  const losers = data.summary?.losers ? data.summary.losers.map(combine) : [];

  return (
    <div className="flex flex-col sm:flex-row sm:space-x-2">
      <section className="w-full sm:w-1/2">
        <List list={winners} theme={{ bg: "bg-green-400", text: "text-white" }}>
          Winners
        </List>
      </section>
      <section className="w-full sm:w-1/2">
        <List list={losers} theme={{ bg: "bg-red-400", text: "text-white" }}>
          Losers
        </List>
      </section>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="bg-blue-400">
        <p>No records found.</p>
      </div>
    );
  }
}

export function ErrorBoundary() {
  return (
    <div className="bg-blue-400">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
