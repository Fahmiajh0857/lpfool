"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input, Label, cn } from "@/components/ui";

const LS_KEY = "fooled_rpc";

export function useRpc() {
  const [rpc, setRpc] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setRpc(saved);
  }, []);

  const save = (v: string) => {
    setRpc(v);
    localStorage.setItem(LS_KEY, v);
  };

  const reset = () => {
    setRpc("");
    localStorage.removeItem(LS_KEY);
  };

  return { rpc, save, reset };
}

export function RpcChip({
  visible,
  rpc,
  onSave,
  onReset,
}: {
  visible: boolean;
  rpc: string;
  onSave: (v: string) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(rpc);

  useEffect(() => setValue(rpc), [rpc]);

  if (!visible) return null;

  return (
    <>
      {/* chip bottom-left */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 rounded-full border border-[rgb(var(--border))] bg-black/30 px-4 py-2 text-xs text-white/80 hover:bg-white/5"
      >
        RPC
      </button>

      {/* sheet */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Card className="mx-auto max-w-xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Custom RPC</div>
                <button
                  className="text-sm text-white/60 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="mt-3 space-y-2">
                <Label>RPC URL (optional)</Label>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="https://..."
                  inputMode="url"
                />
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      onSave(value.trim());
                      window.location.reload();
                      setOpen(false);
                    }}
                  >
                    Set RPC
                  </Button>
                  <Button
                    className="flex-1"
                    variant="ghost"
                    onClick={() => {
                      onReset();
                      setValue("");
                    }}
                  >
                    Reset
                  </Button>
                </div>

                {rpc ? (
                  <div className="pt-1 text-xs text-white/50">
                    Active: <span className="text-white/80">{rpc}</span>
                  </div>
                ) : (
                  <div className="pt-1 text-xs text-white/40">
                    Active: default RPC
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}