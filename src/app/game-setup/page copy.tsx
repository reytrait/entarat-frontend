"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import HeroHeader from "@/app/components/HeroHeader";
import { useGameSetup } from "@/components/game-setup-provider";
import { Ellipse } from "@/components/ui/ellipse";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { GAMES } from "@/lib/constants/game_reviews";

const gameSetupSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  hostingSetting: z.enum(["moderator", "host"]),
  access: z.enum(["private", "public"]),
  numPlayers: z.number().min(1).max(100),
  rounds: z.number().min(1).max(100),
  playTime: z.number().min(1).max(120),
  gameMood: z.enum(["solo", "team"]),
  stickers: z.enum(["on", "off"]),
});

type GameSetupFormValues = z.infer<typeof gameSetupSchema>;

export default function GameSetupPage() {
  const searchParams = useSearchParams();
  const urlGameId = searchParams.get("gameId");

  const {
    gameId,
    setGameId,
    displayName,
    setDisplayName,
    hostingSetting,
    setHostingSetting,
    access,
    setAccess,
    numPlayers,
    setNumPlayers,
    rounds,
    setRounds,
    playTime,
    setPlayTime,
    gameMood,
    setGameMood,
    stickers,
    setStickers,
  } = useGameSetup();

  // Update gameId from URL when it changes
  useEffect(() => {
    if (urlGameId) {
      setGameId(urlGameId);
    }
  }, [urlGameId, setGameId]);

  // Find the game from the gameId
  const game = GAMES.flatMap((cat) => cat.games).find((g) => g.id === gameId);

  const form = useForm<GameSetupFormValues>({
    resolver: zodResolver(gameSetupSchema),
    defaultValues: {
      displayName,
      hostingSetting,
      access,
      numPlayers,
      rounds,
      playTime,
      gameMood,
      stickers,
    },
  });

  // Sync form with provider state
  useEffect(() => {
    form.reset({
      displayName,
      hostingSetting,
      access,
      numPlayers,
      rounds,
      playTime,
      gameMood,
      stickers,
    });
  }, [
    displayName,
    hostingSetting,
    access,
    numPlayers,
    rounds,
    playTime,
    gameMood,
    stickers,
    form,
  ]);

  const handleCreateGame = (values: GameSetupFormValues) => {
    // Update provider with form values
    setDisplayName(values.displayName);
    setHostingSetting(values.hostingSetting);
    setAccess(values.access);
    setNumPlayers(values.numPlayers);
    setRounds(values.rounds);
    setPlayTime(values.playTime);
    setGameMood(values.gameMood);
    setStickers(values.stickers);

    // TODO: Implement game creation logic
    console.log("Creating game with:", {
      gameId,
      ...values,
    });
    // Navigate to game room or show success
  };

  return (
    <div className=" bg-main-bg">
      <div className="min-h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 z-1"
          style={{
            backgroundImage: "url('/patterns/bg_pattern_repeat.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "70% auto",
          }}
        />

        <Ellipse type="2" size="110vw" position={{ y: "0%", x: "0%" }} center />
        <Ellipse
          type="1"
          size="120%w"
          position={{ y: "50%", x: "100%" }}
          center
        />
        <Ellipse
          type="3"
          size="70vw"
          position={{ y: "30%", x: "50%" }}
          center
        />
        <div className="container mx-auto max-md:px-4 px-6 md:px-12  w-dvw overflow-x-hidden relative z-2">
          <HeroHeader />

          <div className="py-8 flex justify-center">
            <div
              className="p-0.5 rounded-2xl"
              style={{
                background: "linear-gradient(90deg, #E200B5 0%, #FFA900 100%)",
              }}
            >
              <div
                className="w-full min-w-[50vw] max-w-2xl rounded-2xl bg-[#1a1a1a] p-6 md:p-8 flex flex-col gap-6"
                style={{
                  background:
                    "linear-gradient(to bottom right, #1B1B1B 15%, #411616 100%)",
                }}
              >
                {game && (
                  <Text variant="body" textColor="white" className="opacity-70">
                    Setting up: {game.title}
                  </Text>
                )}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCreateGame)}
                    className="space-y-8"
                  >
                    {/* Game Setup Section */}
                    <div className="space-y-6">
                      <div className="text-center">
                        <Text variant="h3" textColor="white">
                          Game Setup
                        </Text>
                      </div>

                      {/* Display Name */}
                      <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Display name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your name here"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Hosting Setting */}
                      <FormField
                        control={form.control}
                        name="hostingSetting"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Hosting Setting
                            </FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange("moderator");
                                    setHostingSetting("moderator");
                                  }}
                                  className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                                    field.value === "moderator"
                                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                                      : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-800"
                                  }`}
                                >
                                  Moderator Mood
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange("host");
                                    setHostingSetting("host");
                                  }}
                                  className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                                    field.value === "host"
                                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                                      : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-800"
                                  }`}
                                >
                                  Host and Play
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Access */}
                      <FormField
                        control={form.control}
                        name="access"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Access</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange("private");
                                    setAccess("private");
                                  }}
                                  className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                                    field.value === "private"
                                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                                      : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-800"
                                  }`}
                                >
                                  Private (Passworded)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange("public");
                                    setAccess("public");
                                  }}
                                  className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                                    field.value === "public"
                                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                                      : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-800"
                                  }`}
                                >
                                  Public Game
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Room Setup Section */}
                    <div className="space-y-6">
                      <div className="text-center">
                        <Text variant="h3" textColor="white">
                          Room Setup
                        </Text>
                      </div>

                      {/* Number of Players */}
                      <FormField
                        control={form.control}
                        name="numPlayers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Number of players
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newValue = Math.max(
                                      1,
                                      field.value - 1,
                                    );
                                    field.onChange(newValue);
                                    setNumPlayers(newValue);
                                  }}
                                  className="h-10 w-10 rounded-md border border-gray-600 bg-gray-800/50 text-white transition-colors hover:bg-gray-800 hover:border-orange-500 cursor-pointer"
                                  aria-label="Decrease number of players"
                                >
                                  -
                                </button>
                                <Input
                                  {...field}
                                  type="number"
                                  value={field.value}
                                  onChange={(e) => {
                                    const newValue = Math.max(
                                      1,
                                      parseInt(e.target.value) || 1,
                                    );
                                    field.onChange(newValue);
                                    setNumPlayers(newValue);
                                  }}
                                  className="text-center"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newValue = field.value + 1;
                                    field.onChange(newValue);
                                    setNumPlayers(newValue);
                                  }}
                                  className="h-10 w-10 rounded-md border border-gray-600 bg-gray-800/50 text-white transition-colors hover:bg-gray-800 hover:border-orange-500 cursor-pointer"
                                  aria-label="Increase number of players"
                                >
                                  +
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Rounds */}
                      <FormField
                        control={form.control}
                        name="rounds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Rounds</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newValue = Math.max(
                                      1,
                                      field.value - 1,
                                    );
                                    field.onChange(newValue);
                                    setRounds(newValue);
                                  }}
                                  className="h-10 w-10 rounded-md border border-gray-600 bg-gray-800/50 text-white transition-colors hover:bg-gray-800 hover:border-orange-500 cursor-pointer"
                                  aria-label="Decrease rounds"
                                >
                                  -
                                </button>
                                <Input
                                  {...field}
                                  type="number"
                                  value={field.value}
                                  onChange={(e) => {
                                    const newValue = Math.max(
                                      1,
                                      parseInt(e.target.value) || 1,
                                    );
                                    field.onChange(newValue);
                                    setRounds(newValue);
                                  }}
                                  className="text-center"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newValue = field.value + 1;
                                    field.onChange(newValue);
                                    setRounds(newValue);
                                  }}
                                  className="h-10 w-10 rounded-md border border-gray-600 bg-gray-800/50 text-white transition-colors hover:bg-gray-800 hover:border-orange-500 cursor-pointer"
                                  aria-label="Increase rounds"
                                >
                                  +
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Play Time */}
                      <FormField
                        control={form.control}
                        name="playTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Play Time
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input
                                  {...field}
                                  type="number"
                                  value={field.value}
                                  onChange={(e) => {
                                    const newValue = Math.max(
                                      1,
                                      parseInt(e.target.value) || 1,
                                    );
                                    field.onChange(newValue);
                                    setPlayTime(newValue);
                                  }}
                                  className="flex-1"
                                />
                                <button
                                  type="button"
                                  className="h-10 rounded-md border border-gray-600 bg-gray-800/50 px-6 text-sm text-gray-300 transition-colors hover:bg-gray-800 cursor-pointer"
                                >
                                  Mins
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Game mood */}
                      <FormField
                        control={form.control}
                        name="gameMood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Game mood
                            </FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange("solo");
                                    setGameMood("solo");
                                  }}
                                  className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                                    field.value === "solo"
                                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                                      : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-800"
                                  }`}
                                >
                                  Solo
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange("team");
                                    setGameMood("team");
                                  }}
                                  className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                                    field.value === "team"
                                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                                      : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-800"
                                  }`}
                                >
                                  Team
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Stickers/reactions */}
                      <FormField
                        control={form.control}
                        name="stickers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Stickers/reactions
                            </FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange("off");
                                    setStickers("off");
                                  }}
                                  className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                                    field.value === "off"
                                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                                      : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-800"
                                  }`}
                                >
                                  Off
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange("on");
                                    setStickers("on");
                                  }}
                                  className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                                    field.value === "on"
                                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                                      : "border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-800"
                                  }`}
                                >
                                  On
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Advanced Settings */}
                      <div className="mb-6">
                        <button
                          type="button"
                          className="flex items-center gap-2 text-orange-400 transition-colors hover:text-orange-300 cursor-pointer"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-label="Settings icon"
                          >
                            <title>Settings</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <Text
                            variant="small"
                            textColor="white"
                            className="opacity-80"
                          >
                            Advanced Settings
                          </Text>
                        </button>
                      </div>
                    </div>

                    {/* Create Game Button */}
                    <div className="mt-8">
                      <EntaratBtn
                        variant="primary"
                        size="lg"
                        type="submit"
                        className="w-full"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-label="Add icon"
                        >
                          <title>Add</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Create Game
                      </EntaratBtn>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
