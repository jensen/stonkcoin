import type { Stock } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { fetch } from "@remix-run/node/fetch";

type PolygonStock = Omit<Stock, "currencySymbol" | "currencyName"> & {
  currency_symbol: string;
  currency_name: string;
};

const args = process.argv().slice(2);

if (!args) {
  throw new Error("No api key provided.");
}

const db = new PrismaClient();
db.$connect();

const sleep = (delay = 70 * 1000) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });

async function main() {
  let url =
    "https://api.polygon.io/v3/reference/tickers?active=true&sort=ticker&order=asc&limit=1000&apiKey=qXEAFbq4k84nwJaYz5uqeSl_kh9jYLAo";

  while (true) {
    const tickers = await (await fetch(url)).json();

    if (tickers.status === "ERROR") {
      console.log(tickers);
      console.log("waiting for next budget");
      await sleep();
      console.log("trying again");
    } else {
      console.log(tickers);

      const data = tickers.results.map(
        ({
          ticker,
          name,
          market,
          currency_symbol,
          currency_name,
        }: PolygonStock) => ({
          ticker,
          name,
          market,
          currencySymbol: currency_symbol,
          currencyName: currency_name,
        })
      );

      const create = await db.stock.createMany({ data });

      if (create.count < tickers.count) {
        throw new Error("Did not insert all records");
      }

      url = `${tickers.next_url}&apiKey=${args[0]}`;

      if (tickers.count < 1000) {
        process.exit();
      }
    }
  }
}

main();
