import { cn } from "@/lib/utils";

export interface TestimonialCardProps {
  quote: string;
  name: string;
  avatar: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  name,
  avatar,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/30 bg-black/50 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-white/50 md:p-8",
        className,
      )}
      style={{
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Avatar */}
      <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center text-2xl">
        {avatar}
      </div>

      {/* Quote */}
      <p className="mb-4 text-lg leading-relaxed text-white md:text-xl">
        {quote}
      </p>

      {/* Name */}
      <p className="text-base font-semibold text-white md:text-lg">{name}</p>
    </div>
  );
}
