import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const entaratButtonVariants = cva(
  "cursor-pointer rounded-[38px] inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-[#FFA900] text-gray-900 shadow-[0_0_20px_rgba(255,68,0,0.3)] hover:bg-[#FFB020] hover:shadow-[0_0_25px_rgba(255,68,0,0.5)] dark:bg-[#FFA900] dark:text-black dark:shadow-[0_0_20px_rgba(255,68,0,0.5)] dark:hover:bg-[#FFB020] dark:hover:shadow-[0_0_30px_rgba(255,68,0,0.6)] relative",
        secondary:
          "border-2 border-main-text bg-transparent text-main-text transition-colors hover:bg-main-text/10",
        outline:
          "border-2 border-main-text bg-transparent text-main-text transition-colors hover:bg-main-text/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
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
    const isPrimary = variant === "primary" || variant === undefined;

    if (isPrimary && !asChild) {
      return (
        <div
          className="inline-block rounded-[38px] p-[3px] w-fit"
          style={{
            background: "linear-gradient(135deg, #FFAD0D 1%, #E60000 95%)",
            boxShadow:
              "0 0 20px rgba(255, 173, 13, 0.5), 0 0 40px rgba(230, 0, 0, 0.3), 0 0 60px rgba(255, 173, 13, 0.2)",
          }}
        >
          <Comp
            className={cn(entaratButtonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          />
        </div>
      );
    }

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
