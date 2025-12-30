"use client";

import type React from "react";
import { Ellipse } from "@/components/ui/ellipse";

type PlayFullBgSectionProps = {
  children: React.ReactNode;
};

const PlayFullBgSection = ({ children }: PlayFullBgSectionProps) => {
  return (
    <div className=" bg-main-bg">
      <div className="min-h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 z-1"
          style={{
            backgroundImage: "url('/patterns/bg_pattern_repeat.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "70% auto",
          }}
        />

        <Ellipse type="2" size="110vw" position={{ y: "0%", x: "0%" }} center />
        <Ellipse
          type="1"
          size="120%w"
          position={{ y: "50%", x: "100%" }}
          center
        />
        <Ellipse
          type="3"
          size="70vw"
          position={{ y: "30%", x: "50%" }}
          center
        />
        {children}
      </div>
    </div>
  );
};

export default PlayFullBgSection;
