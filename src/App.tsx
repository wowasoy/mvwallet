import { useWallet } from "./hooks/useWallet";
import { LoadingScreen } from "./components/LoadingScreen";
import { Onboarding } from "./components/Onboarding";
import { LockScreen } from "./components/LockScreen";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const { state, importWallet, unlock, lock, remove } = useWallet();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-15%] w-[35rem] h-[35rem] rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[30rem] h-[30rem] rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      <main className="relative max-w-md mx-auto w-full min-h-screen px-5 py-8 flex flex-col">
        {state.status === "loading" && <LoadingScreen />}

        {state.status === "no-wallet" && <Onboarding onImport={importWallet} />}

        {state.status === "locked" && (
          <LockScreen
            address={state.address}
            onUnlock={unlock}
            onDelete={remove}
          />
        )}

        {state.status === "unlocked" && (
          <Dashboard wallet={state.wallet} onLock={lock} />
        )}
      </main>
    </div>
  );
}