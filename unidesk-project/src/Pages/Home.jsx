import { NavBar } from "../components/NavBar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { UnifiedDesk } from "../components/UnifiedDesk";
import { HowItWorks } from "../components/HowItWorks";
import { Footer } from "../components/Footer";
import { useEffect } from "react";

export function Home() {
  useEffect(() => {
    document.title = "UniDesk";
  }, []);
  return (
    <>
      <NavBar />
      <Hero />
      <About />
      <UnifiedDesk />
      <HowItWorks />
      <Footer />
    </>
  );
}
