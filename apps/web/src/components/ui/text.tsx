import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const textVariants = cva("m-0", {
  variants: {
    variant: {
      h1: "text-5xl md:text-6xl lg:text-7xl font-bold leading-tight",
      h2: "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight",
      h3: "text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",
      h4: "text-2xl md:text-3xl lg:text-4xl font-bold leading-tight",
      body: "text-base md:text-lg",
      lead: "text-lg md:text-xl lg:text-2xl",
      small: "text-xs md:text-sm leading-normal",
      large: "text-xl md:text-2xl",
    },
    textColor: {
      default: "text-main-text",
      white: "text-white",
      muted: "text-gray-700 dark:text-gray-300",
      "white/90": "text-white/90",
      "white/80": "text-white/80",
      "white/60": "text-white/60",
      yellow: "text-yellow-400",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    leading: {
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
  },
  defaultVariants: {
    variant: "body",
    textColor: "default",
    align: "left",
    weight: "normal",
    leading: "normal",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    Omit<VariantProps<typeof textVariants>, "textColor"> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  textColor?:
    | "default"
    | "white"
    | "muted"
    | "white/90"
    | "white/80"
    | "white/60"
    | "yellow"
    | string; // Allow any string for custom Tailwind color classes
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    { className, variant, textColor, align, weight, leading, as, ...props },
    ref,
  ) => {
    // Auto-detect heading element if variant is h1-h4 and no 'as' prop is provided
    const Component =
      as ||
      (variant === "h1"
        ? "h1"
        : variant === "h2"
          ? "h2"
          : variant === "h3"
            ? "h3"
            : variant === "h4"
              ? "h4"
              : "p");
    // Force bold weight for heading variants if not explicitly set
    const finalWeight =
      weight ||
      variant === "h1" ||
      variant === "h2" ||
      variant === "h3" ||
      variant === "h4"
        ? "bold"
        : undefined;

    // Check if textColor is a predefined variant
    const predefinedColors = [
      "default",
      "white",
      "muted",
      "white/90",
      "white/80",
      "white/60",
      "yellow",
    ];
    const isPredefinedColor = textColor && predefinedColors.includes(textColor);

    // Use variant system for predefined colors, otherwise apply directly
    const colorClass = isPredefinedColor
      ? undefined // Will be handled by textVariants
      : textColor; // Apply custom color class directly

    return (
      <Component
        className={cn(
          textVariants({
            variant,
            textColor: isPredefinedColor
              ? (textColor as VariantProps<typeof textVariants>["textColor"])
              : undefined,
            align,
            weight: finalWeight,
            leading,
          }),
          colorClass, // Apply custom color class if not predefined
          className,
        )}
        {...(ref && { ref: ref as never })}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

export { Text, textVariants };
