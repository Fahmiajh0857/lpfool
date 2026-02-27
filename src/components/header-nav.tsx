"use client";

import Link from "next/link";
import { Container } from "@/components/ui";
import { WalletButton } from "@/components/wallet-button";

export function HeaderNav() {
  return (
    <div className="sticky top-0 z-50 border-b border-white/5 bg-[rgb(var(--bg))]/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-black tracking-wide">
            FOOLED
          </Link>

          <Link
            href="/dashboard"
            className="text-sm text-white/65 hover:text-white transition"
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <WalletButton />
        </div>
      </Container>
    </div>
  );
}