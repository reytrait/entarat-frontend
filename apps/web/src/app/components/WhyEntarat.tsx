import { Text } from "../../components/ui/text";
import { WHY_ENTARACT } from "../../lib/constants";
import Image from "next/image";

export function WhyEntarat() {
  return (
    <section
      id="features"
      className="relative w-full overflow-hidden z-2 py-10 md:py-20"
    >
      <div className="relative z-5 mx-auto max-w-7xl self-center container">
        <Text variant="h2" textColor="default" align="center" className="mb-12">
          {WHY_ENTARACT.title}
        </Text>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {WHY_ENTARACT.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl p-8 dark:backdrop-blur-sm flex flex-col items-center gap-4"
              style={{
                background: "linear-gradient(to right, #1B1B1B, #411616)",
              }}
            >
                <Image 
                src={feature.icon} 
                alt={feature.title}   
                  width={80}
                  height={80}
                  className="h-10 w-10"
                
                />

              <Text variant="h3" textColor="white" >
                {feature.title}
              </Text>

              <Text variant="body" textColor="muted" leading="relaxed" align="center">
                {feature.description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
