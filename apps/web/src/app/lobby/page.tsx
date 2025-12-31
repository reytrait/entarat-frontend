import { Suspense } from "react";
import LobbyPage from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LobbyPage />
    </Suspense>
  );
}
