import Image from "next/image";
import type * as React from "react";
import { cn } from "../../lib/utils";

type EllipseType = "1" | "2" | "3";

type EllipseSize =
  | "sm"
  | "md"
  | "lg"
  | number
  | `${number}%w`
  | `${number}%h`
  | `${number}vw`
  | `${number}vh`;

type Position = {
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  x?: string | number;
  y?: string | number;
};

export interface EllipseProps {
  type: EllipseType;
  size?: EllipseSize;
  position?: Position;
  center?: boolean;
  className?: string;
  alt?: string;
}

const sizeMap: Record<string, { width: number; height: number }> = {
  sm: { width: 100, height: 100 },
  md: { width: 200, height: 200 },
  lg: { width: 300, height: 300 },
};

export function Ellipse({
  type,
  size = "md",
  position,
  center = false,
  className,
  alt = "Ellipse decoration",
}: EllipseProps) {
  // Parse size - handle percentage strings, numbers, or predefined sizes
  const getSizeStyle = (): React.CSSProperties => {
    if (typeof size === "number") {
      // Numeric size - use pixels
      return {
        width: `${size}px`,
        height: "auto",
      };
    }

    if (typeof size === "string") {
      // Check for percentage-based sizes
      if (size.endsWith("%w") || size.endsWith("vw")) {
        // Percentage of viewport width
        const value = size.replace("%w", "").replace("vw", "");
        return {
          width: `${value}vw`,
          height: "auto",
        };
      }

      if (size.endsWith("%h") || size.endsWith("vh")) {
        // Percentage of viewport height
        const value = size.replace("%h", "").replace("vh", "");
        return {
          width: `${value}vh`,
          height: "auto",
        };
      }

      // Predefined sizes (sm, md, lg)
      const sizeConfig = sizeMap[size] || sizeMap.md;
      return {
        width: `${sizeConfig.width}px`,
        height: "auto",
      };
    }

    // Fallback
    return {
      width: `${sizeMap.md.width}px`,
      height: "auto",
    };
  };

  const sizeStyle = getSizeStyle();

  // For Next.js Image component, we still need numeric values
  const sizeConfig =
    typeof size === "number"
      ? { width: size, height: undefined }
      : typeof size === "string" &&
          !size.includes("%") &&
          !size.includes("vw") &&
          !size.includes("vh")
        ? sizeMap[size] || sizeMap.md
        : { width: 500, height: undefined }; // Default for percentage sizes

  const positionStyle: React.CSSProperties = {
    position: "absolute",
    ...(position?.top !== undefined && { top: position.top }),
    ...(position?.right !== undefined && { right: position.right }),
    ...(position?.bottom !== undefined && { bottom: position.bottom }),
    ...(position?.left !== undefined && { left: position.left }),
    ...(position?.x !== undefined && { left: position.x }),
    ...(position?.y !== undefined && { top: position.y }),
    ...(center && {
      transform: "translate(-50%, -50%)",
    }),
  };

  // Construct image path - ellipses are in hero_ellipses folder with format "Ellipse {number}.svg"
  const ellipseNumber = String(type);
  const imagePath = `/hero_ellipses/Ellipse_${ellipseNumber}.svg`;

  return (
    <div
      className={cn("pointer-events-none select-none", className)}
      style={{
        ...positionStyle,
        zIndex: 0,
        overflow: "visible",
      }}
    >
      <Image
        src={imagePath}
        alt={alt}
        width={sizeConfig.width}
        height={sizeConfig.height || sizeConfig.width}
        className="h-auto w-auto"
        style={{
          ...sizeStyle,
          maxWidth: "none",
          maxHeight: "none",
        }}
        unoptimized
      />
    </div>
  );
}

// // 50% of viewport width
// <Ellipse type="1" size="50%w" position={{ x: "50%", y: "50%" }} center={true} />

// // 30% of viewport height
// <Ellipse type="2" size="30%h" position={{ top: "10%", left: "10%" }} />

// // Using vw/vh units (same as %w/%h)
// <Ellipse type="3" size="40vw" position={{ x: "50%", y: "50%" }} center={true} />
// <Ellipse type="1" size="25vh" position={{ bottom: "20%", right: "10%" }} />

// // Still supports fixed pixels
// <Ellipse type="2" size={500} position={{ x: "50%", y: "50%" }} center={true} />

// // Still supports predefined sizes
// <Ellipse type="3" size="lg" position={{ top: "10%", left: "5%" }} />
