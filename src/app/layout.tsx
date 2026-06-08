import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rendertool — GB Maatwerkinterieur",
  description: "Pas renders van maatwerkmeubels aan met natuurlijke taal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
