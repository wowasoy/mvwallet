import { Wallet, HDNodeWallet } from "ethers";

export type CreatedWallet = {
  wallet: HDNodeWallet;
  mnemonic: string;
};

export function createWallet(): CreatedWallet {
  const random = Wallet.createRandom();
  const mnemonic = random.mnemonic?.phrase;
  if (!mnemonic) {
    throw new Error("Failed to generate mnemonic");
  }
  const wallet = HDNodeWallet.fromPhrase(mnemonic);
  return { wallet, mnemonic };
}

export function importFromMnemonic(mnemonic: string): HDNodeWallet {
  const cleaned = mnemonic.trim().toLowerCase().replace(/\s+/g, " ");
  const wallet = HDNodeWallet.fromPhrase(cleaned);
  return wallet;
}

export async function encryptWallet(
  wallet: HDNodeWallet,
  password: string
): Promise<string> {
  return await wallet.encrypt(password);
}

export async function decryptWallet(
  encryptedJson: string,
  password: string
): Promise<HDNodeWallet> {
  const wallet = await Wallet.fromEncryptedJson(encryptedJson, password);
  return wallet as HDNodeWallet;
}