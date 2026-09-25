import { useState } from "react";
import { HDNodeWallet, Wallet } from "ethers";
import { SUPPORTED_TOKENS, type TokenInfo } from "../lib/constants";
import { getTokenContract, parseTokenAmount } from "../lib/erc20";
import { getProvider } from "../lib/provider";
import { normalizeAddress } from "../lib/validation";
import { sanitizeError } from "../lib/errors";

type Props = {
  wallet: HDNodeWallet;
  onSent: () => void;
};

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "confirmed"; hash: string }
  | { state: "error"; message: string };

export function SendTokenForm({ wallet, onSent }: Props) {
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(
    SUPPORTED_TOKENS[0]!
  );
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const normalizedRecipient = normalizeAddress(recipient);
  const parsedAmount = parseTokenAmount(amount, selectedToken);
  const isInputValid = normalizedRecipient !== null && parsedAmount !== null;
  const isBusy = status.state === "sending";

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInputValid) return;

    setStatus({ state: "sending" });

    try {
      const provider = getProvider();
      const connected = new Wallet(wallet.privateKey, provider);
      const contract = getTokenContract(selectedToken, provider).connect(
        connected
      ) as ReturnType<typeof getTokenContract>;

      const tx = await contract.transfer(normalizedRecipient, parsedAmount);
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
      <h2 className="text-lg font-semibold">Send Token</h2>

      <div>
        <label htmlFor="token-select" className="label">
          Token
        </label>
        <select
          id="token-select"
          value={selectedToken.address}
          onChange={(e) => {
            const found = SUPPORTED_TOKENS.find(
              (t) => t.address === e.target.value
            );
            if (found) setSelectedToken(found);
          }}
          disabled={isBusy}
          className="glass-input font-mono text-sm"
        >
          {SUPPORTED_TOKENS.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol} — {token.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="token-recipient" className="label">
          Recipient
        </label>
        <input
          id="token-recipient"
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
        <label htmlFor="token-amount" className="label">
          Amount ({selectedToken.symbol})
        </label>
        <input
          id="token-amount"
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
        {isBusy ? "Sending..." : `Send ${selectedToken.symbol}`}
      </button>

      {status.state === "confirmed" && (
        <p role="status" className="text-emerald-300 text-xs break-all">
          Confirmed: {status.hash}
        </p>
      )}

      {status.state === "error" && (
        <p role="alert" className="text-red-300 text-xs">
          {status.message}
        </p>
      )}
    </form>
  );
}