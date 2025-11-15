import TheBoard from "@/components/the-board.js";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen bg-linear-to-b from-theme-red to-theme-red-200 font-sans dark:bg-black p-8">
      <main className="max-w-4xl w-full h-[calc(100vh-64px)] p-8 bg-black/15 backdrop-blur-md rounded-2xl">
        <TheBoard />
      </main>
    </div>
  );
}
