export const CHAIN_ID = 11155111;
export const CHAIN_NAME = "Sepolia";
export const EXPLORER_BASE = "https://sepolia.etherscan.io";
export const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";

export type TokenInfo = {
  symbol: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
};

export const SUPPORTED_TOKENS: readonly TokenInfo[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    decimals: 6
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    decimals: 18
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    decimals: 18
  }
] as const;