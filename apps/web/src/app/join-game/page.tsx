import { Suspense } from "react";
import JoinGamePage from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <JoinGamePage />
    </Suspense>
  );
}
