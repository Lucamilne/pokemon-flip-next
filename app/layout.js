import "./globals.css";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import ClientProviders from "@/components/ClientProviders.js";
import AppShell from "./AppShell.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata = {
  title: "Pokémon Flip | Strategic Card Battle Game",
  description: "A strategic card battle game inspired by Triple Triad, featuring Pokémon cards with elemental types and stat-based combat.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} antialiased`}
      >
        <ClientProviders>
          <AppShell>
            {children}
          </AppShell>
        </ClientProviders>
      </body>
    </html>
  );
}
