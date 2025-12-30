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
        "relative rounded-2xl border border-white/20 bg-black/40 p-6 backdrop-blur-md transition-transform hover:scale-105 md:p-8",
        className,
      )}
      style={{
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Avatar */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-2xl">
        {avatar}
      </div>

      {/* Quote */}
      <p className="mb-4 text-lg leading-relaxed text-white md:text-xl">
        {quote}
      </p>

      {/* Name */}
      <p className="text-base font-semibold text-white/80 md:text-lg">{name}</p>
    </div>
  );
}
