import { useCallback, useEffect, useState } from "react";
import { SUPPORTED_TOKENS, type TokenInfo } from "../lib/constants";
import { getTokenBalance } from "../lib/erc20";
import { sanitizeError } from "../lib/errors";

export type TokenBalance = {
  token: TokenInfo;
  balance: bigint;
};

export function useTokenBalances(address: string | null) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!address) {
      setBalances([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        SUPPORTED_TOKENS.map(async (token) => ({
          token,
          balance: await getTokenBalance(token, address)
        }))
      );
      setBalances(results);
    } catch (err) {
      setError(sanitizeError(err));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void fetchBalances();
  }, [fetchBalances]);

  return { balances, loading, error, refresh: fetchBalances };
}