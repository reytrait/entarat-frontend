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
  // Initialize with empty values to avoid hydration mismatch
  const [displayName, setDisplayName] = React.useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = React.useState<string | null>(
    null,
  );
  const [mounted, setMounted] = React.useState(false);

  // Load from localStorage after mount
  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("entarat-user-display-name");
      const storedAvatar = localStorage.getItem("entarat-user-avatar");
      if (storedName) {
        setDisplayName(storedName);
      }
      if (storedAvatar) {
        setSelectedAvatar(storedAvatar);
      }
    }
  }, []);

  // Persist to localStorage after mount
  React.useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      if (displayName) {
        localStorage.setItem("entarat-user-display-name", displayName);
      } else {
        localStorage.removeItem("entarat-user-display-name");
      }
    }
  }, [displayName, mounted]);

  React.useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      if (selectedAvatar) {
        localStorage.setItem("entarat-user-avatar", selectedAvatar);
      } else {
        localStorage.removeItem("entarat-user-avatar");
      }
    }
  }, [selectedAvatar, mounted]);

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
