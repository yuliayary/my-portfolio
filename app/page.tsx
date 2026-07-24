import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import WorkGrid from "@/components/sections/WorkGrid";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <WorkGrid />
      </main>
      <Footer />
    </>
  );
}
