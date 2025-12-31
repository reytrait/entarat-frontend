"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Ellipse } from "../../components/ui/ellipse";
import { TestimonialCard } from "../../components/ui/testimonial-card";
import { Text } from "../../components/ui/text";
import { TESTIMONIALS } from "../../lib/constants";

export function Testimonial() {
  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden py-20 md:py-32 bg-main-bg"
    >
      <Ellipse type="2" size="50%w" position={{ y: "0%", x: "10%" }} center />
      <Ellipse type="1" size="110vw" position={{ y: "0%", x: "0%" }} center />
      <Ellipse type="2" size="50%w" position={{ y: "90%", x: "100%" }} center />
      <Ellipse type="3" size="50vw" position={{ y: "110%", x: "20%" }} center />
      <Ellipse type="2" size="50%w" position={{ y: "90%", x: "100%" }} center />
      <Ellipse type="3" size="80vw" position={{ y: "0%", x: "90%" }} center />

      {/* Content */}
      <div className="relative z-10 mx-auto container max-md:px-4 text-center md:px-12">
        {/* Title */}
        <Text variant="h2" textColor="white" align="center" className="mb-12">
          {TESTIMONIALS.title}
        </Text>

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
            <SplideSlide
              key={`${testimonial.name}-${testimonial.quote.slice(0, 20)}-${index}`}
            >
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
                  bgColor={testimonial.bgColor}
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
