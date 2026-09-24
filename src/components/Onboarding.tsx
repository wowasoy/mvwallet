import { useState } from "react";
import { EthLogo } from "./EthLogo";
import { createWallet } from "../lib/wallet";
import { sanitizeError } from "../lib/errors";

type Props = {
  onImport: (mnemonic: string, password: string) => Promise<void>;
};

type Step = "choose" | "create" | "import";

export function Onboarding({ onImport }: Props) {
  const [step, setStep] = useState<Step>("choose");
  const [pendingMnemonic, setPendingMnemonic] = useState<string | null>(null);
  const [mnemonicInput, setMnemonicInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmSaved, setConfirmSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setPendingMnemonic(null);
    setMnemonicInput("");
    setPassword("");
    setConfirmSaved(false);
    setError(null);
  };

  const handleChooseCreate = () => {
    setError(null);
    try {
      const { mnemonic } = createWallet();
      setPendingMnemonic(mnemonic);
      setStep("create");
    } catch (err) {
      setError(sanitizeError(err));
    }
  };

  const handleChooseImport = () => {
    reset();
    setStep("import");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingMnemonic || !confirmSaved) return;

    setBusy(true);
    setError(null);

    try {
      await onImport(pendingMnemonic, password);
    } catch (err) {
      setError(sanitizeError(err));
      setBusy(false);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await onImport(mnemonicInput, password);
    } catch (err) {
      setError(sanitizeError(err));
      setBusy(false);
    }
  };

  if (step === "choose") {
    return (
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <EthLogo className="w-20 h-20 drop-shadow-2xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">mvwallet</h1>
          <p className="text-white/60 text-sm">
            Self-custodial EVM wallet for Sepolia Testnet
          </p>
        </div>

        <div className="glass p-6 space-y-3">
          <button onClick={handleChooseCreate} className="btn-primary">
            Create New Wallet
          </button>
          <button onClick={handleChooseImport} className="btn-secondary">
            Import Existing Wallet
          </button>
        </div>

        {error && (
          <p role="alert" className="text-red-300 text-xs text-center">
            {error}
          </p>
        )}

        <p className="text-white/40 text-xs text-center px-4">
          This wallet runs entirely in your browser. Your seed phrase never
          leaves this device.
        </p>
      </div>
    );
  }

  if (step === "create" && pendingMnemonic) {
    return (
      <form
        onSubmit={handleCreateSubmit}
        className="flex-1 flex flex-col justify-center gap-5"
      >
        <div className="glass p-6 space-y-4">
          <h2 className="text-xl font-semibold">Save your seed phrase</h2>
          <p className="text-white/60 text-sm">
            Write these 12 words down. Anyone with this phrase can access your
            wallet. Never share it.
          </p>

          <div className="bg-black/40 border border-emerald-400/20 rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-2 text-sm font-mono">
              {pendingMnemonic.split(" ").map((word, i) => (
                <div key={i} className="flex items-baseline gap-1.5">
                  <span className="text-white/40 text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-emerald-300">{word}</span>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmSaved}
              onChange={(e) => setConfirmSaved(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-emerald-500"
            />
            <span className="text-sm text-white/80">
              I have written down my seed phrase and stored it safely.
            </span>
          </label>
        </div>

        <div className="glass p-6 space-y-4">
          <div>
            <label htmlFor="create-password" className="label">
              Password (encrypts your wallet)
            </label>
            <input
              id="create-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              autoComplete="new-password"
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
            disabled={
              !password || password.length < 8 || !confirmSaved || busy
            }
            className="btn-primary"
          >
            {busy ? "Creating..." : "Create Wallet"}
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
              setStep("choose");
            }}
            className="btn-ghost w-full text-center"
          >
            Back
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleImportSubmit}
      className="flex-1 flex flex-col justify-center gap-5"
    >
      <div className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">Import your wallet</h2>
        <p className="text-white/60 text-sm">
          Enter your 12 or 24 word seed phrase.
        </p>

        <div>
          <label htmlFor="import-mnemonic" className="label">
            Seed phrase
          </label>
          <textarea
            id="import-mnemonic"
            value={mnemonicInput}
            onChange={(e) => setMnemonicInput(e.target.value)}
            placeholder="word1 word2 word3 ..."
            rows={3}
            autoComplete="off"
            spellCheck={false}
            disabled={busy}
            required
            className="glass-input font-mono text-sm resize-none"
          />
        </div>

        <div>
          <label htmlFor="import-password" className="label">
            Password (encrypts on this device)
          </label>
          <input
            id="import-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            autoComplete="new-password"
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
          disabled={!mnemonicInput.trim() || password.length < 8 || busy}
          className="btn-primary"
        >
          {busy ? "Importing..." : "Import Wallet"}
        </button>

        <button
          type="button"
          onClick={() => {
            reset();
            setStep("choose");
          }}
          className="btn-ghost w-full text-center"
        >
          Back
        </button>
      </div>
    </form>
  );
}