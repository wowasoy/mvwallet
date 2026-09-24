import { useState } from "react";
import { HDNodeWallet } from "ethers";
import { sanitizeError } from "../lib/errors";

type Props = {
  wallet: HDNodeWallet;
};

export function ExportMnemonic({ wallet }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mnemonic = wallet.mnemonic?.phrase;

  const handleReveal = () => {
    setError(null);
    if (!mnemonic) {
      setError("No mnemonic available for this wallet.");
      return;
    }
    setRevealed(true);
  };

  const handleCopy = async () => {
    if (!mnemonic) return;
    try {
      await navigator.clipboard.writeText(mnemonic);
    } catch (err) {
      setError(sanitizeError(err));
    }
  };

  if (error) {
    return (
      <div className="mt-4 pt-4 border-t border-white/10">
        <p role="alert" className="text-red-300 text-xs">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
      <p className="text-xs text-red-300/80 leading-relaxed">
        Anyone with this phrase can access your funds. Never share it. Never
        paste it into any website.
      </p>

      {revealed && mnemonic ? (
        <>
          <div className="bg-black/40 border border-red-400/20 rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {mnemonic.split(" ").map((word, i) => (
                <div key={i} className="flex items-baseline gap-1">
                  <span className="text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-white">{word}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 text-xs bg-white/5 border border-white/15 rounded-xl py-2 hover:bg-white/10 transition-colors"
            >
              Copy phrase
            </button>
            <button
              onClick={() => setRevealed(false)}
              className="flex-1 text-xs bg-white/5 border border-white/15 rounded-xl py-2 hover:bg-white/10 transition-colors"
            >
              Hide
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={handleReveal}
          className="w-full text-xs bg-red-500/10 border border-red-400/30 text-red-200 rounded-xl py-2.5 hover:bg-red-500/20 transition-colors"
        >
          Reveal seed phrase
        </button>
      )}
    </div>
  );
}