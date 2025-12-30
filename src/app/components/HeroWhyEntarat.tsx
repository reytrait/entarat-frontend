import { Ellipse } from "@/components/ui/ellipse";
import { Hero } from "./Hero";
import { WhyEntarat } from "./WhyEntarat";

const HeroWhyEntarat = () => {
  return (
    <div className="relative bg-[#03010B] overflow-x-hidden">
      {/* Sticky Background Pattern - sticks while scrolling through content, then scrolls away */}
      <div
        className="sticky top-0 z-1 h-screen w-full opacity-70"
        style={{
          backgroundImage: "url('/lines_bg.svg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
        }}
      />

      {/* Content wrapper - pushes sticky background to scroll away at bottom */}
      <div className="relative -mt-[200vh]">
        <div className="h-screen" />
        <Hero />
        <WhyEntarat />
      </div>

      <Ellipse type="2" size="110vw" position={{ y: "0%", x: "0%" }} center />
      <Ellipse
        type="1"
        size="120%w"
        position={{ y: "50%", x: "100%" }}
        center
      />
      <Ellipse type="3" size="70vw" position={{ y: "30%", x: "50%" }} center />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Ellipse
          type="3"
          size="70vw"
          position={{ y: "95%", x: "50%" }}
          center
        />
        <Ellipse
          type="2"
          size="120vw"
          position={{ y: "100%", x: "0%" }}
          center
        />
      </div>
    </div>
  );
};

export default HeroWhyEntarat;
