import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import HeroWhyEntarat from "./components/HeroWhyEntarat";
import { HowItWorks } from "./components/HowItWorks";
import { ModernPlayful } from "./components/ModernPlayful";
import { Testimonial } from "./components/Testimonial";
import { WhyEntarat } from "./components/WhyEntarat";
export default function Home() {
  return (
    <>
      {/* Sticky Background Pattern - sticks while scrolling through content, then scrolls away */}
      <div
        className="fixed top-0 z-1 h-screen w-dvw opacity-70"
        style={{
          backgroundImage: "url('/lines_bg.svg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
        }}
      />

      {/* <Hero />
      <WhyEntarat /> */}
      <HeroWhyEntarat />
      <HowItWorks />
      <ModernPlayful />
      <Testimonial />
    </>
  );
}
