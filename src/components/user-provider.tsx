"use client";

import * as React from "react";

type UserProviderState = {
  displayName: string;
  setDisplayName: (name: string) => void;
  selectedAvatar: string | null;
  setSelectedAvatar: (avatar: string | null) => void;
  reset: () => void;
};

const initialState: UserProviderState = {
  displayName: "",
  setDisplayName: () => null,
  selectedAvatar: null,
  setSelectedAvatar: () => null,
  reset: () => null,
};

const UserProviderContext =
  React.createContext<UserProviderState>(initialState);

type UserProviderProps = {
  children: React.ReactNode;
};

export function UserProvider({ children, ...props }: UserProviderProps) {
  const [displayName, setDisplayName] = React.useState<string>(() => {
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem("entarat-user-display-name");
    return stored || "";
  });

  const [selectedAvatar, setSelectedAvatar] = React.useState<string | null>(
    () => {
      if (typeof window === "undefined") return null;
      const stored = localStorage.getItem("entarat-user-avatar");
      return stored || null;
    },
  );

  // Persist to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (displayName) {
        localStorage.setItem("entarat-user-display-name", displayName);
      } else {
        localStorage.removeItem("entarat-user-display-name");
      }
    }
  }, [displayName]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedAvatar) {
        localStorage.setItem("entarat-user-avatar", selectedAvatar);
      } else {
        localStorage.removeItem("entarat-user-avatar");
      }
    }
  }, [selectedAvatar]);

  const reset = React.useCallback(() => {
    setDisplayName("");
    setSelectedAvatar(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("entarat-user-display-name");
      localStorage.removeItem("entarat-user-avatar");
    }
  }, []);

  const value = React.useMemo(
    () => ({
      displayName,
      setDisplayName,
      selectedAvatar,
      setSelectedAvatar,
      reset,
    }),
    [displayName, selectedAvatar, reset],
  );

  return (
    <UserProviderContext.Provider {...props} value={value}>
      {children}
    </UserProviderContext.Provider>
  );
}

export const useUser = () => {
  const context = React.useContext(UserProviderContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
