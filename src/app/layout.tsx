import "./globals.css";
import ClientRoot from "./client-root";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FOOLED",
  description: "Meteora DLMM LP tool",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}