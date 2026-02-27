"use client";

import { HeaderNav } from "@/components/header-nav";
import { Button, Card, Container, Input, Label } from "@/components/ui";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { getPoolInfo } from "@/lib/meteora";
import { useRpc } from "@/components/rpc-sheet";

<Card className="p-4">
  {loading && <div className="text-sm text-white/55">Loading pool info...</div>}

  {info && (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-lg font-bold">
          {info.tokenX.slice(0,4)} / {info.tokenY.slice(0,4)}
        </div>
        <div className="text-xs text-white/45">
          Bin Step: {info.binStep}
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm">
          Price: {Number(info.price).toFixed(4)}
        </div>
        <div className="text-xs text-white/45">
          Fee: {(info.feeBps / 100).toFixed(2)}%
        </div>
      </div>
    </div>
  )}
</Card>

type Tab = "chart" | "create" | "positions";

export default function PoolPage() {
  const params = useParams<{ address: string }>();
  const address = useMemo(() => String(params.address || ""), [params.address]);

  const [wallet, setWallet] = useState<string | null>("KleiN1111111111111111111111111111111111111");
  const [tab, setTab] = useState<Tab>("chart");

  const { rpc } = useRpc();
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!address) return;

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPoolInfo(
        rpc || "https://api.mainnet-beta.solana.com",
        address
      );
      setInfo(data);
    } catch (e) {
      console.error("pool fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [address, rpc]);

  return (
    <div className="min-h-screen bg-grid">
      <HeaderNav
        walletAddress={wallet}
        onConnect={() => setWallet("KleiN1111111111111111111111111111111111111")}
        onDisconnect={() => setWallet(null)}
      />

      <Container className="py-8 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xl font-bold">Pool</div>
            <div className="text-xs text-white/55 break-all">{address}</div>
          </div>

          <div className="flex gap-2">
            <Button variant={tab === "chart" ? "primary" : "ghost"} onClick={() => setTab("chart")}>
              Chart
            </Button>
            <Button variant={tab === "create" ? "primary" : "ghost"} onClick={() => setTab("create")}>
              Create
            </Button>
            <Button variant={tab === "positions" ? "primary" : "ghost"} onClick={() => setTab("positions")}>
              Your Position
            </Button>
          </div>
        </div>

        {tab === "chart" && (
          <Card className="p-4">
            <div className="font-semibold">Chart</div>
            <div className="mt-2 text-sm text-white/55">
              Placeholder. Nanti masukin TradingView lightweight chart + overlay range.
            </div>
            <div className="mt-4 h-[320px] rounded-[16px] border border-[rgb(var(--border))] bg-black/30" />
          </Card>
        )}

        {tab === "create" && (
          <Card className="p-4 space-y-4">
            <div>
              <div className="font-semibold">Create Position</div>
              <div className="text-sm text-white/55">
                Strategy + range slider (unified) + refundable SOL preview.
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Strategy</Label>
                <Input placeholder="Wide / Narrow / Custom (later)" />
              </div>
              <div>
                <Label>Range (temporary)</Label>
                <Input placeholder="Unified dual slider next" />
              </div>
            </div>

            <Card className="p-4 bg-black/20 border border-[rgb(var(--border))]">
              <div className="text-sm font-semibold">Preview</div>
              <div className="mt-2 text-sm text-white/55">
                Refundable SOL: <span className="text-white/80">--</span>
              </div>
              <div className="text-sm text-white/55">
                Estimated Fees APR: <span className="text-white/80">--</span>
              </div>
            </Card>

            <Button disabled={!wallet}>Open Position</Button>
            {!wallet && (
              <div className="text-xs text-[rgb(var(--danger))]">
                Connect wallet to create position.
              </div>
            )}
          </Card>
        )}

        {tab === "positions" && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="font-semibold">Your Positions</div>
              <div className="mt-2 text-sm text-white/55">
                Placeholder (hawkfi-like). Nanti ada WD/Depo/Claim/Close/Zip/Configure.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="ghost">WD</Button>
                <Button variant="ghost">Deposit</Button>
                <Button variant="ghost">Claim</Button>
                <Button variant="ghost">Close</Button>
                <Button variant="ghost">Zip</Button>
                <Button>Configure</Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="font-semibold">PnL</div>
              <div className="mt-2 text-sm text-white/55">
                Placeholder. Nanti tampil: Live PnL, fees, range status, auto rules.
              </div>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}