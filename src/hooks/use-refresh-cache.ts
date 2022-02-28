import { useEffect } from "react";
import { useFetcher } from "remix";

export default function useRefreshCache() {
  const { submit } = useFetcher();

  useEffect(() => {
    submit({}, { action: "/stocks/cache", method: "post" });
  }, [submit]);
}
