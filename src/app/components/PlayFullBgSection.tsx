"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { Ellipse } from "@/components/ui/ellipse";

type PlayFullBgSectionProps = {
  children: React.ReactNode;
};

const PlayFullBgSection = ({ children }: PlayFullBgSectionProps) => {
  const pathname = usePathname();
  const isJoinGamePage = pathname === "/join-game";

  return (
    <div className=" bg-main-bg">
      {!isJoinGamePage && (
        <Link
          href="/join-game"
          className="cursor-pointer absolute top-0 right-0 bg-amber-200 z-99"
        >
          Join a Game
        </Link>
      )}
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
