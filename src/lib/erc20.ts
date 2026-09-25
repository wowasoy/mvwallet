import { Contract, JsonRpcProvider, formatUnits, parseUnits } from "ethers";
import { getProvider } from "./provider";
import type { TokenInfo } from "./constants";

const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)"
] as const;

type ERC20ReadContract = {
  balanceOf: (account: string) => Promise<bigint>;
  decimals: () => Promise<bigint>;
  symbol: () => Promise<string>;
};

export function getTokenReadContract(
  token: TokenInfo,
  provider?: JsonRpcProvider
): ERC20ReadContract {
  const contract = new Contract(
    token.address,
    ERC20_ABI,
    provider ?? getProvider()
  );
  return contract as unknown as ERC20ReadContract;
}

export async function getTokenBalance(
  token: TokenInfo,
  address: string
): Promise<bigint> {
  const contract = getTokenReadContract(token);
  const raw = await contract.balanceOf(address);
  return raw;
}

export function formatTokenAmount(
  amount: bigint,
  token: TokenInfo
): string {
  return formatUnits(amount, token.decimals);
}

export function parseTokenAmount(
  input: string,
  token: TokenInfo
): bigint | null {
  const trimmed = input.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return null;
  }
  try {
    const parsed = parseUnits(trimmed, token.decimals);
    if (parsed <= 0n) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}