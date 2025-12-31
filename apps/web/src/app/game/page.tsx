import { Suspense } from "react";
import GamePage from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GamePage />
    </Suspense>
  );
}
