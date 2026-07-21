import About from "../components/About";
import Contribute from "../components/Contribute";
import Explore from "../components/Explore";
import Features from "../components/Features";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import { useSEO } from "../hooks/useSEO";

export default function HomePage() {
  useSEO({
    title: "Airhop - Private, offline-first messenger",
    description:
      "Private peer-to-peer messaging for iOS and Android. No internet, no servers, no accounts. Communicate over Bluetooth mesh anywhere.",
    path: "/",
  });

  return (
    <main id="main-content">
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Explore />
      <Contribute />
    </main>
  );
}
