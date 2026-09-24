import { isAddress, getAddress, parseEther } from "ethers";

export function normalizeAddress(input: string): string | null {
  const trimmed = input.trim();
  if (!isAddress(trimmed)) {
    return null;
  }
  try {
    return getAddress(trimmed);
  } catch {
    return null;
  }
}

export function parseAmount(input: string): bigint | null {
  const trimmed = input.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return null;
  }
  try {
    const parsed = parseEther(trimmed);
    if (parsed <= 0n) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}