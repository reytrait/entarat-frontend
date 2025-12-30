"use client";

import * as React from "react";

type HostingSetting = "moderator" | "host";
type Access = "private" | "public";
type GameMood = "solo" | "team";
type Stickers = "on" | "off";

type GameSetupProviderState = {
  gameId: string | null;
  setGameId: (gameId: string | null) => void;
  displayName: string;
  setDisplayName: (name: string) => void;
  hostingSetting: HostingSetting;
  setHostingSetting: (setting: HostingSetting) => void;
  access: Access;
  setAccess: (access: Access) => void;
  numPlayers: number;
  setNumPlayers: (players: number) => void;
  rounds: number;
  setRounds: (rounds: number) => void;
  playTime: number;
  setPlayTime: (time: number) => void;
  gameMood: GameMood;
  setGameMood: (mood: GameMood) => void;
  stickers: Stickers;
  setStickers: (stickers: Stickers) => void;
  reset: () => void;
};

const initialState: GameSetupProviderState = {
  gameId: null,
  setGameId: () => null,
  displayName: "",
  setDisplayName: () => null,
  hostingSetting: "moderator",
  setHostingSetting: () => null,
  access: "private",
  setAccess: () => null,
  numPlayers: 12,
  setNumPlayers: () => null,
  rounds: 12,
  setRounds: () => null,
  playTime: 15,
  setPlayTime: () => null,
  gameMood: "solo",
  setGameMood: () => null,
  stickers: "off",
  setStickers: () => null,
  reset: () => null,
};

const GameSetupProviderContext =
  React.createContext<GameSetupProviderState>(initialState);

type GameSetupProviderProps = {
  children: React.ReactNode;
};

export function GameSetupProvider({
  children,
  ...props
}: GameSetupProviderProps) {
  const [gameId, setGameId] = React.useState<string | null>(null);
  const [displayName, setDisplayName] = React.useState("");
  const [hostingSetting, setHostingSetting] =
    React.useState<HostingSetting>("moderator");
  const [access, setAccess] = React.useState<Access>("private");
  const [numPlayers, setNumPlayers] = React.useState(12);
  const [rounds, setRounds] = React.useState(12);
  const [playTime, setPlayTime] = React.useState(15);
  const [gameMood, setGameMood] = React.useState<GameMood>("solo");
  const [stickers, setStickers] = React.useState<Stickers>("off");

  const reset = React.useCallback(() => {
    setGameId(null);
    setDisplayName("");
    setHostingSetting("moderator");
    setAccess("private");
    setNumPlayers(12);
    setRounds(12);
    setPlayTime(15);
    setGameMood("solo");
    setStickers("off");
  }, []);

  const value = {
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
    reset,
  };

  return (
    <GameSetupProviderContext.Provider {...props} value={value}>
      {children}
    </GameSetupProviderContext.Provider>
  );
}

export const useGameSetup = () => {
  const context = React.useContext(GameSetupProviderContext);

  if (context === undefined)
    throw new Error("useGameSetup must be used within a GameSetupProvider");

  return context;
};

