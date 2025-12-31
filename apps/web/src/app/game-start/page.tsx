import { Suspense } from "react";
import GameStartPage from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GameStartPage />
    </Suspense>
  );
}
