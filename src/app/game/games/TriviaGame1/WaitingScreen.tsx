import PlayFullBgSection from "@/app/components/PlayFullBgSection";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { Text } from "@/components/ui/text";

type WaitingScreenProps = {
  onStartGame: () => void;
};

export function WaitingScreen({ onStartGame }: WaitingScreenProps) {
  return (
    <PlayFullBgSection>
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Text variant="h2" textColor="white" className="mb-4">
            Waiting for game to start...
          </Text>
          <EntaratBtn variant="primary" onClick={onStartGame}>
            Start Game
          </EntaratBtn>
        </div>
      </div>
    </PlayFullBgSection>
  );
}
