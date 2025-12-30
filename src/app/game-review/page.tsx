"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroHeader from "@/app/components/HeroHeader";
import { Text } from "@/components/ui/text";
import { GAMES } from "@/lib/constants/game_reviews";

export default function GameReviewPage() {
  const router = useRouter();
  const categories = ["All", ...GAMES.map((cat) => cat.category)] as const;

  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]>("All");

  const handleGameClick = (gameId: string) => {
    router.push(`/game-setup?gameId=${gameId}`);
  };

  // Filter categories based on selection
  const filteredCategories =
    selectedCategory === "All"
      ? GAMES
      : GAMES.filter((cat) => cat.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#03010B]">
      <div className="container mx-auto max-md:px-4 px-6 md:px-12">
        {/* Header */}
        <HeroHeader />

        {/* Main Title */}
        <div className="mt-12 mb-8 text-center">
          <Text variant="h1" textColor="white" align="center">
            Choose your game
          </Text>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`cursor-pointer rounded-full text-base font-medium transition-all ${
                  isSelected
                    ? "p-[2px]"
                    : "px-6 py-2 text-white/70 hover:text-white"
                }`}
                style={
                  isSelected
                    ? {
                        background:
                          "linear-gradient(90deg, #E200B5 0%, #FFA900 100%)",
                        boxShadow:
                          "0 0 10px rgba(226, 0, 181, 0.5), 0 0 20px rgba(255, 169, 0, 0.3)",
                      }
                    : undefined
                }
              >
                {isSelected ? (
                  <div
                    className="rounded-full px-6 py-2 text-white font-bold"
                    style={{
                      background: "#1a1a1a",
                    }}
                  >
                    {category}
                  </div>
                ) : (
                  category
                )}
              </button>
            );
          })}
        </div>

        {/* Game Categories with Border Frames */}
        <div className="flex flex-col gap-6 py-8">
          {filteredCategories.map((categoryGroup) => (
            <div
              key={categoryGroup.category}
              className="rounded-2xl p-[2px] border-0"
              style={{
                background: "linear-gradient(90deg, #E200B5 0%, #FFA900 100%)",
              }}
            >
              <div
                className="rounded-2xl p-4 md:p-8 h-full w-full"
                style={{
                  background:
                    "linear-gradient(to bottom right, #1B1B1B 15%, #411616 100%)",
                }}
              >
                {/* Game Cards Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryGroup.games.map((game) => (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => handleGameClick(game.id)}
                      className="cursor-pointer group relative overflow-hidden rounded-2xl p-4 transition-transform hover:scale-105 flex flex-col items-center justify-center border-[0.5px] w-full"
                      style={{
                        backgroundColor: game.bgColor,
                        borderColor: game.borderColor,
                      }}
                    >
                      {/* Avatars */}
                      <div className="flex items-center justify-center gap-2">
                        {game.avatars ? (
                          game.avatars?.map((avatar) => (
                            <div
                              key={avatar.src}
                              className="relative h-24 w-24"
                            >
                              <Image
                                src={avatar.src}
                                alt={avatar.alt}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                          ))
                        ) : categoryGroup.defaultAvatar ? (
                          <div className="relative h-24 w-24">
                            <Image
                              src={categoryGroup.defaultAvatar.src}
                              alt={categoryGroup.defaultAvatar.alt}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        ) : null}
                      </div>

                      {/* Title */}
                      <Text variant="h3" textColor="white" className="mb-2">
                        {game.title}
                      </Text>

                      {/* Subtitle */}
                      <Text
                        variant="small"
                        textColor="white"
                        className="mb-3 opacity-90"
                        weight="semibold"
                      >
                        {game.subtitle}
                      </Text>

                      {/* Description */}
                      <Text
                        variant="small"
                        textColor="white"
                        className="opacity-80"
                        align="center"
                      >
                        {game.description}
                      </Text>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
