import HeroWhyEntarat from "./components/HeroWhyEntarat";
import { HowItWorks } from "./components/HowItWorks";
import { ModernPlayful } from "./components/ModernPlayful";
import { Testimonial } from "./components/Testimonial";
export default function Home() {
  return (
    <>
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

      <HeroWhyEntarat />
      <HowItWorks />
      <ModernPlayful />
      <Testimonial />
    </>
  );
}
