import Board from "@/components/Board/Board.js";
import HowToPlay from "@/components/HowToPlay/HowToPlay.js";
import GoogleSignInButton from "@/components/GoogleSignInButton/GoogleSignInButton.js";

export default function Home() {
  return (
    <div className="bg-linear-to-b from-theme-red-100 to-theme-red-200">
      <main className="flex justify-center min-h-screen font-sans bg-black/15 lg:p-8">
        {/* <div className="absolute top-4 right-4">
          <GoogleSignInButton />
        </div> */}
        <div className="h-screen lg:h-[calc(100vh-64px)] shadow-lg/50 overflow-hidden">
          <Board />
        </div>
      </main>
      {/* <HowToPlay /> */}
    </div>
  );
}
