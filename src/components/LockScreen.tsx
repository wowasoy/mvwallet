import { useState } from "react";
import { EthLogo } from "./EthLogo";
import { sanitizeError } from "../lib/errors";
import { formatAddress } from "../lib/validation";

type Props = {
  address: string;
  onUnlock: (password: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

export function LockScreen({ address, onUnlock, onDelete }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await onUnlock(password);
    } catch (err) {
      setError(sanitizeError(err));
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setBusy(true);
    try {
      await onDelete();
    } catch (err) {
      setError(sanitizeError(err));
      setBusy(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center gap-5">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <EthLogo className="w-14 h-14 drop-shadow-2xl" />
        </div>
        <h1 className="text-2xl font-bold">mvwallet</h1>
        <p className="text-white/40 text-xs font-mono">
          {formatAddress(address)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
        <div>
          <label htmlFor="unlock-password" className="label">
            Password
          </label>
          <input
            id="unlock-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            disabled={busy}
            required
            className="glass-input"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-300 text-xs">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!password || busy}
          className="btn-primary"
        >
          {busy ? "Unlocking..." : "Unlock"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="btn-ghost w-full text-center text-red-300/70 hover:text-red-300"
        >
          {confirmDelete ? "Tap again to confirm deletion" : "Delete wallet"}
        </button>
      </form>
    </div>
  );
}