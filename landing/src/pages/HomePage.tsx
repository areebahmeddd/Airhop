import About from "../components/About";
import Contribute from "../components/Contribute";
import Explore from "../components/Explore";
import Features from "../components/Features";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Explore />
      <Contribute />
    </>
  );
}
