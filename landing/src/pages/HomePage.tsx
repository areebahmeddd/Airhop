import About from "@/components/sections/About";
import AppShowcase from "@/components/sections/AppShowcase";
import Compare from "@/components/sections/Compare";
import Contribute from "@/components/sections/Contribute";
import Explore from "@/components/sections/Explore";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Situations from "@/components/sections/Situations";
import { useSEO } from "@/hooks/useSEO";
import { SEO } from "@/lib/seo";

export default function HomePage() {
  useSEO(SEO["/"]);

  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <About />
      <Situations />
      <AppShowcase />
      <HowItWorks />
      <Features />
      <Compare />
      <Explore />
      <Contribute />
    </main>
  );
}
