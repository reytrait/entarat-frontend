import { Ellipse } from "../../components/ui/ellipse";
import { Hero } from "./Hero";
import { WhyEntarat } from "./WhyEntarat";

const HeroWhyEntarat = () => {
  return (
    <div
      className="relative overflow-x-hidden"
      style={{
        backgroundColor: "var(--hero-bg, #03010B)",
      }}
    >
      <div className="relative container mx-auto max-md:px-4">
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
