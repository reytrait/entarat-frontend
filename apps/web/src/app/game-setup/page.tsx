import { Suspense } from "react";
import GameSetupPage from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GameSetupPage />
    </Suspense>
  );
}
