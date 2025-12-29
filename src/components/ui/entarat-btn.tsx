import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const entaratButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-amber-400 text-gray-900 shadow-[0_0_20px_rgba(255,68,0,0.3)] hover:bg-amber-500 hover:shadow-[0_0_25px_rgba(255,68,0,0.5)] dark:bg-amber-400 dark:text-black dark:shadow-[0_0_20px_rgba(255,68,0,0.5)] dark:hover:bg-amber-500 dark:hover:shadow-[0_0_30px_rgba(255,68,0,0.6)]",
        secondary:
          "border-2 border-gray-900 bg-transparent text-gray-900 transition-colors hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-white/10",
        outline:
          "border-2 border-gray-900 bg-transparent text-gray-900 transition-colors hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-white/10",
      },
      size: {
        default: "h-10 px-5 py-2 text-base",
        sm: "h-9 px-4 py-2 text-sm",
        lg: "h-12 px-8 py-3 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface EntaratBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof entaratButtonVariants> {
  asChild?: boolean;
}

const EntaratBtn = React.forwardRef<HTMLButtonElement, EntaratBtnProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(entaratButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
EntaratBtn.displayName = "EntaratBtn";

export { EntaratBtn, entaratButtonVariants };
