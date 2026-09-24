import { EthLogo } from "./EthLogo";

export function LoadingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6">
      <EthLogo className="w-16 h-16 opacity-70 animate-pulse" />
      <p className="text-white/50 text-sm">Loading wallet...</p>
    </div>
  );
}