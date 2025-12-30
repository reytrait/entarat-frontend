"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { TESTIMONIALS } from "@/lib/constants";

export function Testimonial() {
  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden py-20 md:py-32"
      style={{
        background:
          "linear-gradient(to bottom, rgb(88 28 135), rgb(20 83 45), rgb(0 0 0))",
      }}
    >
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/lines_bg.svg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        {/* Title */}
        <h2 className="mb-12 text-center text-5xl font-bold text-white md:text-6xl lg:text-7xl">
          {TESTIMONIALS.title}
        </h2>

        {/* Carousel */}
        <Splide
          options={{
            type: "loop",
            perPage: 3,
            perMove: 1,
            gap: "2rem",
            pagination: true,
            arrows: true,
            breakpoints: {
              1024: {
                perPage: 3,
              },
              768: {
                perPage: 2,
              },
              640: {
                perPage: 1,
              },
            },
          }}
          className="testimonial-carousel"
        >
          {TESTIMONIALS.items.map((testimonial, index) => (
            <SplideSlide key={`${testimonial.name}-${testimonial.quote.slice(0, 20)}-${index}`}>
              <div
                className="transform transition-transform hover:rotate-1"
                style={{
                  transform: `rotate(${index % 2 === 0 ? "-2" : "2"}deg)`,
                }}
              >
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  avatar={testimonial.avatar}
                />
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>

      <style jsx global>{`
        .testimonial-carousel .splide__pagination {
          bottom: -3rem;
        }

        .testimonial-carousel .splide__pagination__page {
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
        }

        .testimonial-carousel .splide__pagination__page.is-active {
          background: white;
        }

        .testimonial-carousel .splide__arrow {
          background: rgba(255, 255, 255, 0.2);
          opacity: 1;
        }

        .testimonial-carousel .splide__arrow:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        .testimonial-carousel .splide__arrow svg {
          fill: white;
        }

        .testimonial-carousel .splide__arrow--prev {
          left: -3rem;
        }

        .testimonial-carousel .splide__arrow--next {
          right: -3rem;
        }

        @media (max-width: 1024px) {
          .testimonial-carousel .splide__arrow--prev {
            left: -1rem;
          }

          .testimonial-carousel .splide__arrow--next {
            right: -1rem;
          }
        }
      `}</style>
    </section>
  );
}
