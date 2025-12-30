import Link from "next/link";
import PlayFullBgSection from "@/app/components/PlayFullBgSection";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { Text } from "@/components/ui/text";

export default function NotFound() {
  return (
    <PlayFullBgSection>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="space-y-6">
          <Text variant="h1" textColor="white" align="center">
            404
          </Text>
          <Text variant="h2" textColor="white" align="center">
            Page Not Found
          </Text>
          <Text
            variant="body"
            textColor="white"
            align="center"
            className="opacity-80"
          >
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <div className="flex justify-center pt-4">
            <Link href="/">
              <EntaratBtn variant="primary" size="lg">
                Go to Homepage
              </EntaratBtn>
            </Link>
          </div>
        </div>
      </div>
    </PlayFullBgSection>
  );
}
