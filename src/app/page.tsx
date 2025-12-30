import Image from "next/image";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { ModernPlayful } from "./components/ModernPlayful";
import { Testimonial } from "./components/Testimonial";
import { WhyEntarat } from "./components/WhyEntarat";
export default function Home() {
  return (
    <div>
      <Hero />
      <WhyEntarat />
      <HowItWorks />
      <ModernPlayful />
      <Testimonial />
      <Footer />
    </div>
  );
}
