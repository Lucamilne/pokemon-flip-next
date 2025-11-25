'use client';

import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
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
    switch (pathname) {
      case '/pokemon-select':
        return { backgroundColor: '#59acff' };
      case '/play':
        return { backgroundColor: '#e61919' };
      default:
        return { backgroundColor: '#ddd' };
    }
  };

  return (
    <html lang="en">
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
              <div className="text-center">
                <h1 className="font-press-start text-2xl mb-6 text-white header-text ">
                  Pokémon Flip
                </h1>
                <p className="font-press-start text-sm text-white/90 leading-relaxed drop-shadow-md">
                  This game is not available on mobile devices.
                  <br /><br />
                  Please visit on a tablet or desktop.
                </p>
              </div>
            </div>

            {/* Main app - hidden on mobile */}
            <main className="hidden md:flex justify-center min-h-screen font-sans bg-black/15 lg:p-8">
              <div className="h-screen lg:h-[calc(100vh-64px)] shadow-lg/50 overflow-hidden w-full max-w-5xl">
                {children}
              </div>
            </main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
