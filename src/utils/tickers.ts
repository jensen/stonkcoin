import type { PrismaClient, Stock as IStock } from "@prisma/client";

export const getTickers = async (
  db: PrismaClient,
  symbols: Stock[]
): Promise<IStock[]> => {
  return await db.stock.findMany({
    where: {
      ticker: {
        in: symbols.map((stock: Stock) => stock.T),
      },
    },
  });
};
