"use client";

import { HeaderNav } from "@/components/header-nav";
import { Card, Container, Label } from "@/components/ui";
import { useState } from "react";

export default function DashboardPage() {
  const [wallet, setWallet] = useState<string | null>("KleiN1111111111111111111111111111111111111");

  return (
    <div className="min-h-screen bg-grid">
      <HeaderNav
        walletAddress={wallet}
        onConnect={() => setWallet("KleiN1111111111111111111111111111111111111")}
        onDisconnect={() => setWallet(null)}
      />

      <Container className="py-8 space-y-6">
        <div>
          <div className="text-xl font-bold">Dashboard</div>
          <div className="text-sm text-white/55">
            Active positions & closed history (placeholder for now).
          </div>
        </div>

        <Card className="p-4">
          <div className="font-semibold">Active Positions</div>
          <div className="mt-2 text-sm text-white/55">
            (nanti diisi list posisi dari Meteora)
          </div>
        </Card>

        <Card className="p-4">
          <div className="font-semibold">Closed Positions History</div>
          <div className="mt-2 text-sm text-white/55">
            (nanti diisi realized PnL + refunded SOL)
          </div>
        </Card>
      </Container>
    </div>
  );
}