import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Scenarios from "@/components/Scenarios";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <main className="overflow-x-hidden">
      <Nav />
      <Hero />
      <HowItWorks />
      <Scenarios />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
}
