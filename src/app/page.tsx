"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Container, Input, Label, Button, cn } from "@/components/ui";
import { RpcChip, useRpc } from "@/components/rpc-sheet";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButtonClient } from "@/components/wallet-multi-button.client";

const RECENT_KEY = "fooled_recent_pools";

function isMeteoraUrl(u: string) {
  try {
    const url = new URL(u);
    return url.hostname.includes("meteora");
  } catch {
    return false;
  }
}

// Parser: "meteora link only" OR pool address (base58-like length)
function extractPoolAddress(input: string): { pool: string | null; reason?: string } {
  const v = input.trim();
  if (!v) return { pool: null };

  // if url
  if (v.startsWith("http")) {
    if (!isMeteoraUrl(v)) return { pool: null, reason: "Link must be from Meteora." };

    try {
      const url = new URL(v);

      // common params (fallbacks)
      const fromParams =
        url.searchParams.get("pool") ||
        url.searchParams.get("address") ||
        url.searchParams.get("pair") ||
        url.searchParams.get("poolAddress");

      if (fromParams && fromParams.length >= 20) return { pool: fromParams };

      const seg = url.pathname.split("/").filter(Boolean).pop();
      if (seg && seg.length >= 20) return { pool: seg };

      return { pool: null, reason: "Couldn't detect pool address in that Meteora link." };
    } catch {
      return { pool: null, reason: "Invalid URL format." };
    }
  }

  // if not url, require it to look like a pool address
  if (v.length < 20) return { pool: null, reason: "Paste Meteora link (or pool address)." };

  return { pool: v };
}

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function pushRecent(pool: string) {
  const prev = loadRecent();
  const next = [pool, ...prev.filter((p) => p !== pool)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export default function HomePage() {
  const router = useRouter();
  const { connected } = useWallet();
  const { rpc, save, reset } = useRpc();

  const [value, setValue] = useState("");
  const [recent, setRecent] = useState<string[]>(() => loadRecent());

  const parsed = useMemo(() => extractPoolAddress(value), [value]);
  const canGo = !!parsed.pool;

  const go = (pool: string) => {
    pushRecent(pool);
    setRecent(loadRecent());
    router.push(`/pool/${pool}`);
  };

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-[rgb(var(--bg))]/80 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-black tracking-wide">
              FOOLED
            </Link>
            <Link href="/dashboard" className="text-sm text-white/65 hover:text-white transition">
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <WalletMultiButtonClient style={{ height: 44, borderRadius: 12 }} />
          </div>
        </Container>
      </div>

      {/* Main */}
      <Container className="py-10">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="text-center">
            <div className="text-4xl font-black tracking-tight sm:text-6xl">
              FO<span className="text-white/70">OLED</span>
            </div>
            <p className="mt-3 text-sm text-white/55">
              Paste Meteora pool link only. Fast, accurate, Android-first.
            </p>
          </div>

          {/* Search Card */}
          <Card className="
mt-8 p-5
bg-gradient-to-b from-white/[0.03] to-white/[0.01]
backdrop-blur-xl
border border-white/10
shadow-[0_20px_80px_rgba(0,0,0,0.5)]
">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Meteora Pool</div>
                <div className="text-xs text-white/45">Link only → opens Pool Page</div>
              </div>
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    const t = await navigator.clipboard.readText();
                    setValue(t);
                  } catch {
                    // no-op
                  }
                }}
              >
                Paste
              </Button>
            </div>

            <div className="mt-4">
              <Label>Pool link</Label>
              <div className="mt-3 relative">
  <Input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Paste Meteora Pool Link"
    className="pr-24 h-14 text-sm"
  />

  <button
    disabled={!canGo}
    onClick={() => parsed.pool && go(parsed.pool)}
    className={cn(
      "absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 rounded-[10px]",
      "text-sm font-semibold transition",
      canGo
        ? "bg-white text-black"
        : "bg-white/10 text-white/30"
    )}
  >
    Open
  </button>
</div>

              {value && !canGo && (
                <div className="mt-2 text-xs text-[rgb(var(--danger))]">
                  {parsed.reason ?? "Invalid input."}
                </div>
              )}

              {canGo && (
                <div className="mt-2 text-xs text-white/45">
                  Detected pool: <span className="text-white/80">{parsed.pool}</span>
                </div>
              )}
            </div>

            {/* Recent */}
            <div className="mt-5 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/45">Recent pools</div>
                {recent.length > 0 && (
                  <button
                    className="text-xs text-white/50 hover:text-white"
                    onClick={() => {
                      localStorage.removeItem(RECENT_KEY);
                      setRecent([]);
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {recent.length === 0 ? (
                <div className="mt-2 text-sm text-white/35">No history yet.</div>
              ) : (
                <div className="mt-3 grid gap-2">
                  {recent.map((p) => (
                    <button
                      key={p}
                      onClick={() => go(p)}
                      className={cn(
                        "flex items-center justify-between rounded-[14px] border border-[rgb(var(--border))] bg-black/20 px-4 py-3 text-left",
                        "hover:bg-white/5"
                      )}
                    >
                      <div className="text-sm font-semibold truncate">{p}</div>
                      <div className="text-xs text-white/45">Open</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer info */}
            <div className="mt-5 text-xs text-white/40">
              RPC: <span className="text-white/70">{rpc ? rpc : "default"}</span>
              <span className="mx-2">•</span>
              Wallet: <span className="text-white/70">{connected ? "connected" : "not connected"}</span>
            </div>
          </Card>
        </div>
      </Container>

      {/* RPC chip only when wallet connected */}
      <RpcChip visible={connected} rpc={rpc} onSave={(v) => { save(v); window.location.reload(); }} onReset={() => { reset(); window.location.reload(); }} />
    </div>
  );
}