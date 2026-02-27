"use client";

import dynamic from "next/dynamic";

<WalletMultiButton
  className="wallet-adapter-dropdown"
  style={{
    height: 40,
    borderRadius: 12,
    background: "#fff",
    color: "#000"
  }}
/>

export const WalletMultiButtonClient = dynamic(
  async () => {
    const mod = await import("@solana/wallet-adapter-react-ui");
    return mod.WalletMultiButton;
  },
  { ssr: false }
);