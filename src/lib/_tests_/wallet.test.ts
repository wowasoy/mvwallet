import { describe, it, expect } from "vitest";
import { createWallet, importFromMnemonic } from "../wallet";

const HARDHAT_MNEMONIC =
  "test test test test test test test test test test test junk";

const HARDHAT_FIRST_ADDRESS =
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

describe("createWallet", () => {
  it("returns a wallet with a 12-word mnemonic", () => {
    const result = createWallet();
    const words = result.mnemonic.split(" ");
    expect(words).toHaveLength(12);
  });

  it("returns a valid Ethereum address", () => {
    const result = createWallet();
    expect(result.wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  it("returns a wallet with a private key", () => {
    const result = createWallet();
    expect(result.wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
  });

  it("generates unique mnemonics on repeated calls", () => {
    const a = createWallet();
    const b = createWallet();
    expect(a.mnemonic).not.toBe(b.mnemonic);
  });
});

describe("importFromMnemonic", () => {
  it("derives a deterministic address from a known mnemonic", () => {
    const wallet = importFromMnemonic(HARDHAT_MNEMONIC);
    expect(wallet.address).toBe(HARDHAT_FIRST_ADDRESS);
  });

  it("normalizes uppercase input", () => {
    const wallet = importFromMnemonic(HARDHAT_MNEMONIC.toUpperCase());
    expect(wallet.address).toBe(HARDHAT_FIRST_ADDRESS);
  });

  it("normalizes multiple spaces", () => {
    const wallet = importFromMnemonic(
      "test  test   test test test test test test test test test junk"
    );
    expect(wallet.address).toBe(HARDHAT_FIRST_ADDRESS);
  });

  it("trims leading and trailing whitespace", () => {
    const wallet = importFromMnemonic(`   ${HARDHAT_MNEMONIC}   `);
    expect(wallet.address).toBe(HARDHAT_FIRST_ADDRESS);
  });

  it("throws on invalid mnemonic", () => {
    expect(() => importFromMnemonic("not a valid mnemonic")).toThrow();
    expect(() => importFromMnemonic("")).toThrow();
  });
});