import { formatTokenAmount } from "../lib/erc20";
import type { TokenBalance } from "../hooks/useTokenBalances";

type Props = {
  balances: TokenBalance[];
  loading: boolean;
  error: string | null;
};

export function TokenList({ balances, loading, error }: Props) {
  if (loading) {
    return (
      <div className="glass p-6">
        <p className="text-white/50 text-sm">Loading tokens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-6">
        <p role="alert" className="text-red-300 text-sm">
          {error}
        </p>
      </div>
    );
  }

  const activeBalances = balances.filter((b) => b.balance > 0n);

  if (activeBalances.length === 0) {
    return (
      <div className="glass p-6">
        <p className="label mb-0">Token Balances</p>
        <p className="text-white/50 text-sm mt-2">
          No tokens found. Get test tokens from a Sepolia faucet.
        </p>
      </div>
    );
  }

  return (
    <div className="glass p-6 space-y-3">
      <p className="label mb-0">Token Balances</p>
      <div className="space-y-2 mt-2">
        {activeBalances.map(({ token, balance }) => (
          <div
            key={token.address}
            className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0"
          >
            <div>
              <p className="text-sm font-medium text-white">{token.symbol}</p>
              <p className="text-xs text-white/40">{token.name}</p>
            </div>
            <p className="font-mono text-sm text-white">
              {formatTokenAmount(balance, token)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}