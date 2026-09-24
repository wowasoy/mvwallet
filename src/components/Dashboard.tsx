import { useState } from "react";
import { HDNodeWallet, formatEther } from "ethers";
import { EthLogo } from "./EthLogo";
import { SendForm } from "./SendForm";
import { ExportMnemonic } from "./ExportMnemonic";
import { useBalance } from "../hooks/useBalance";
import { formatAddress } from "../lib/validation";
import { EXPLORER_BASE } from "../lib/constants";

type Props = {
  wallet: HDNodeWallet;
  onLock: () => void;
};

export function Dashboard({ wallet, onLock }: Props) {
  const { balance, loading, error, refresh } = useBalance(wallet.address);
  const [showExport, setShowExport] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
    } catch {
      // clipboard unavailable; ignore
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <EthLogo className="w-8 h-8" />
          <span className="font-semibold">mvwallet</span>
        </div>
        <button onClick={onLock} className="btn-ghost">
          Lock
        </button>
      </header>

      <div className="glass p-6 space-y-4">
        <div>
          <p className="label mb-0">Address</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm text-white/90">
              {formatAddress(wallet.address)}
            </span>
            <button
              onClick={handleCopyAddress}
              className="text-xs text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="label mb-0">Balance</p>
          <div className="mt-1">
            {loading ? (
              <p className="text-white/50 text-sm">Loading...</p>
            ) : error ? (
              <p role="alert" className="text-red-300 text-sm">
                {error}
              </p>
            ) : (
              <p className="text-3xl font-mono font-semibold">
                {balance !== null ? formatEther(balance) : "0"}{" "}
                <span className="text-emerald-400 text-xl">ETH</span>
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <a
            href={`${EXPLORER_BASE}/address/${wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            View on Etherscan
          </a>
        </div>
      </div>

      <SendForm wallet={wallet} onSent={refresh} />

      <div className="glass-soft p-4">
        <button
          onClick={() => setShowExport((v) => !v)}
          className="w-full flex items-center justify-between text-sm text-white/70 hover:text-white transition-colors"
        >
          <span>Export seed phrase</span>
          <span className="text-white/40">{showExport ? "−" : "+"}</span>
        </button>

        {showExport && <ExportMnemonic wallet={wallet} />}
      </div>
    </div>
  );
}