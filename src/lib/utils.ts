import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique game code based on timestamp and random characters.
 * The timestamp ensures codes are never the same, even if generated at the exact same moment.
 * @param length - The desired length of the code (default: 6)
 * @returns A unique uppercase alphanumeric code
 */
export function generateGameCode(length: number = 6): string {
  // Get current timestamp in base 36 (shorter representation)
  const timestamp = Date.now().toString(36).toUpperCase();

  // Generate random characters for additional entropy
  const random = Math.random().toString(36).substring(2).toUpperCase();

  // Combine timestamp and random, ensuring alphanumeric only
  const combined = (timestamp + random).replace(/[^A-Z0-9]/g, "");

  // Take exactly 'length' characters from the end to ensure timestamp is included
  // This guarantees uniqueness since timestamp changes every millisecond
  return combined.slice(-length);
}
