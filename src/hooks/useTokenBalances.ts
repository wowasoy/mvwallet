import { useCallback, useEffect, useState } from "react";
import { SUPPORTED_TOKENS, type TokenInfo } from "../lib/constants";
import { getTokenBalance } from "../lib/erc20";
import { getProvider } from "../lib/provider";
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
      const provider = getProvider();

      const results = await Promise.all(
        SUPPORTED_TOKENS.map(async (token) => {
          try {
            const code = await provider.getCode(token.address);
            if (!code || code === "0x") {
              return null;
            }
            const balance = await getTokenBalance(token, address);
            return { token, balance };
          } catch {
            return null;
          }
        })
      );

      const validBalances = results.filter(
        (item): item is TokenBalance => item !== null
      );
      setBalances(validBalances);
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