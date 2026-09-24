import { useState } from "react";
import { HDNodeWallet, Wallet, parseEther } from "ethers";
import { getProvider } from "../lib/provider";
import { normalizeAddress, parseAmount } from "../lib/validation";
import { sanitizeError } from "../lib/errors";
import { EXPLORER_BASE } from "../lib/constants";

type Props = {
  wallet: HDNodeWallet;
  onSent: () => void;
};

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "confirmed"; hash: string }
  | { state: "error"; message: string };

export function SendForm({ wallet, onSent }: Props) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const normalizedRecipient = normalizeAddress(recipient);
  const parsedAmount = parseAmount(amount);
  const isInputValid = normalizedRecipient !== null && parsedAmount !== null;
  const isBusy = status.state === "sending";

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInputValid) return;

    setStatus({ state: "sending" });

    try {
      const provider = getProvider();
      const connected = new Wallet(wallet.privateKey, provider);
      const tx = await connected.sendTransaction({
        to: normalizedRecipient,
        value: parseEther(amount.trim())
      });
      const receipt = await tx.wait();
      if (receipt) {
        setStatus({ state: "confirmed", hash: receipt.hash });
        setRecipient("");
        setAmount("");
        onSent();
      }
    } catch (err) {
      setStatus({ state: "error", message: sanitizeError(err) });
    }
  };

  return (
    <form onSubmit={send} className="glass p-6 space-y-4">
      <h2 className="text-lg font-semibold">Send ETH</h2>

      <div>
        <label htmlFor="recipient" className="label">
          Recipient
        </label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          autoComplete="off"
          spellCheck={false}
          disabled={isBusy}
          className="glass-input font-mono text-sm"
        />
      </div>

      <div>
        <label htmlFor="amount" className="label">
          Amount (ETH)
        </label>
        <input
          id="amount"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.01"
          autoComplete="off"
          spellCheck={false}
          disabled={isBusy}
          className="glass-input font-mono text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={!isInputValid || isBusy}
        className="btn-primary"
      >
        {isBusy ? "Sending..." : "Send"}
      </button>

      {status.state === "confirmed" && (
        <div className="text-xs space-y-1">
          <p className="text-emerald-300">Transaction confirmed.</p>
          <a
            href={`${EXPLORER_BASE}/tx/${status.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline break-all"
          >
            {status.hash}
          </a>
        </div>
      )}

      {status.state === "error" && (
        <p role="alert" className="text-red-300 text-xs">
          {status.message}
        </p>
      )}
    </form>
  );
}