import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { SeizedOverlay } from "@/components/SeizedOverlay";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "O mais otário",
  description: "Eleição oficial mensal das piores traquinagens do grupo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-sans)]">
        <SeizedOverlay />
        {children}
      </body>
    </html>
  );
}
