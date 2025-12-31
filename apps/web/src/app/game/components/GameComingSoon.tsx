import { Text } from "../../../components/ui/text";
import PlayFullBgSection from "../../components/PlayFullBgSection";

const GameComingSoon = ({ gameId }: { gameId: string }) => {
  return (
    <PlayFullBgSection>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <Text variant="h1" textColor="white" align="center" className="mb-4">
            Game Started!
          </Text>
          <Text
            variant="body"
            textColor="white"
            align="center"
            className="opacity-80"
          >
            Game ID: {gameId}
          </Text>
          <Text
            variant="body"
            textColor="white"
            align="center"
            className="mt-4 opacity-60"
          >
            Main game interface coming soon...
          </Text>
        </div>
      </div>
    </PlayFullBgSection>
  );
};

export default GameComingSoon;
