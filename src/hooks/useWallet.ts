import { useCallback, useEffect, useState } from "react";
import { HDNodeWallet } from "ethers";
import { importFromMnemonic, encryptWallet, decryptWallet } from "../lib/wallet";
import { loadVault, saveVault, deleteVault } from "../lib/storage";

export type WalletState =
  | { status: "loading" }
  | { status: "no-wallet" }
  | { status: "locked"; address: string }
  | { status: "unlocked"; wallet: HDNodeWallet };

export function useWallet() {
  const [state, setState] = useState<WalletState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    loadVault()
      .then((vault) => {
        if (cancelled) return;
        if (vault) {
          setState({ status: "locked", address: vault.address });
        } else {
          setState({ status: "no-wallet" });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: "no-wallet" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const importWallet = useCallback(
    async (mnemonic: string, password: string): Promise<void> => {
      const wallet = importFromMnemonic(mnemonic);
      const encryptedJson = await encryptWallet(wallet, password);
      await saveVault({
        encryptedJson,
        address: wallet.address,
        createdAt: Date.now()
      });
      setState({ status: "unlocked", wallet });
    },
    []
  );

  const unlock = useCallback(async (password: string): Promise<void> => {
    const vault = await loadVault();
    if (!vault) {
      throw new Error("No wallet found on this device.");
    }
    const wallet = await decryptWallet(vault.encryptedJson, password);
    setState({ status: "unlocked", wallet });
  }, []);

  const lock = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "unlocked") return prev;
      return { status: "locked", address: prev.wallet.address };
    });
  }, []);

  const remove = useCallback(async (): Promise<void> => {
    await deleteVault();
    setState({ status: "no-wallet" });
  }, []);

  return { state, importWallet, unlock, lock, remove };
}