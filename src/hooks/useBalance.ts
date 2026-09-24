import { useCallback, useEffect, useState } from "react";
import { getProvider } from "../lib/provider";
import { sanitizeError } from "../lib/errors";

export function useBalance(address: string | null) {
  const [balance, setBalance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address) {
      setBalance(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = getProvider();
      const raw = await provider.getBalance(address);
      setBalance(raw);
    } catch (err) {
      setError(sanitizeError(err));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, refresh: fetchBalance };
}