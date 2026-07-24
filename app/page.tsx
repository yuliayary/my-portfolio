import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import WorkGrid from "@/components/sections/WorkGrid";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <WorkGrid />
        {/* TODO: Footer section not built yet */}
        <div className="flex h-screen items-center justify-center text-body1 font-body text-grey-light">
          Footer section — TODO
        </div>
      </main>
    </>
  );
}
