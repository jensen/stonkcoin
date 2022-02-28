export const getDaily = async (
  today: string
): Promise<{ count: number; results: any[] }> =>
  await (
    await fetch(
      `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${today}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.POLYGON_API_KEY}`,
        },
      }
    )
  ).json();
