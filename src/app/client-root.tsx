"use client";

import Providers from "./providers";
import { useEffect, useState } from "react";

const LS_KEY = "fooled_rpc";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [rpc, setRpc] = useState<string>("https://api.mainnet-beta.solana.com");

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setRpc(saved);
  }, []);

  return <Providers rpcUrl={rpc}>{children}</Providers>;
}