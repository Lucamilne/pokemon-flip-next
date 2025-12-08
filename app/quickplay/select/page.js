"use client"

import Select from "@/components/Select/Select";

export default function Home() {
  return (
    <>
      <section className="overflow-hidden relative h-full flex flex-col gap-4 bg-neutral-400 md:rounded-xl" >
        <Select />
      </section>
    </>
  );
}
