import { JsonRpcProvider } from "ethers";
import { CHAIN_ID, RPC_URL } from "./constants";

let cached: JsonRpcProvider | null = null;

export function getProvider(): JsonRpcProvider {
  if (!cached) {
    cached = new JsonRpcProvider(RPC_URL, CHAIN_ID);
  }
  return cached;
}