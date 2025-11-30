'use client';

import "./globals.css";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import ClientProviders from "@/components/ClientProviders.js";
import { usePathname } from "next/navigation";

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

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const getBackgroundStyle = () => {
    if (pathname.endsWith('/select')) {
      return { backgroundColor: '#59acff' };
    }
    if (pathname.endsWith('/play')) {
      return { backgroundColor: '#e61919' };
    }
    if (pathname.endsWith('/result')) {
      return { backgroundColor: '#fff' };
    }
    return { backgroundColor: '#ddd' };
  };

  return (
    <html lang="en">
      <head>
        <title>Pokémon Flip | Strategic Card Battle Game</title>
        <meta name="description" content="A strategic card battle game inspired by Triple Triad, featuring Pokémon cards with elemental types and stat-based combat." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={`${process.env.NODE_ENV === 'production' ? '/pokemon-flip-next' : ''}/favicon.ico`} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} antialiased`}
      >
        <ClientProviders>
          <div
            className="text-black transition-all duration-400 ease-in-out"
            style={getBackgroundStyle()}
          >
            {/* Mobile splash screen */}
            <div className="block md:hidden min-h-screen flex items-center justify-center p-8">
              <div className="text-center default-tile border-8 border-black p-2 shadow-lg/30">
                <h1 className="font-press-start bg-theme-red border-b-8 border-theme-red-100 py-4 text-3xl header-text">
                  Pokémon Flip
                </h1>
                <p className="font-press-start text-sm leading-relaxed drop-shadow-md mt-2 py-4">
                  This game is not available on mobile devices.
                  <br /><br />
                  Please visit on a tablet or desktop.
                </p>
              </div>
            </div>

            {/* Main app - hidden on mobile */}
            <main className="hidden md:flex justify-center min-h-screen font-sans bg-black/15 lg:p-8">
              <div className="h-screen lg:h-[calc(100vh-64px)] overflow-hidden w-full max-w-5xl">
                {children}
              </div>
            </main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
