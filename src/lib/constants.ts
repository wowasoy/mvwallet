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
    symbol: "USDT",
    name: "Tether USD",
    address: "0x7169d38820dfd117c3fa1f22a697dba58d90ba06",
    decimals: 6
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    address: "0xC32a7fCB1cC8E247D9b8ED74220f6F8A61341F4F",
    decimals: 6
  },
  {
    symbol: "XAUT",
    name: "Tether Gold",
    address: "0x6b4858eda0e021cbe39835d691cd0a1807574103",
    decimals: 18
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x324befe00354823df73691e37ed4f7b19ad74f63",
    decimals: 8
  }
] as const;