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

/**
 * Creates a hash from a string using a simple hash function.
 * @param str - The string to hash
 * @returns A hexadecimal hash string
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generates a device fingerprint based on device characteristics.
 * This creates a unique identifier based on hardware/software properties.
 * @returns A device fingerprint string
 */
function generateDeviceFingerprint(): string {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return `unknown-${Date.now()}`;
  }

  // Collect device-specific characteristics
  const nav = navigator as Navigator & {
    deviceMemory?: number;
  };
  const characteristics = [
    navigator.userAgent || "",
    navigator.language || "",
    navigator.languages?.join(",") || "",
    screen.width?.toString() || "",
    screen.height?.toString() || "",
    screen.colorDepth?.toString() || "",
    new Date().getTimezoneOffset().toString(),
    navigator.hardwareConcurrency?.toString() || "",
    nav.deviceMemory?.toString() || "",
    navigator.cookieEnabled?.toString() || "",
    window.screen?.pixelDepth?.toString() || "",
  ].join("|");

  // Create a hash from the characteristics
  const fingerprint = simpleHash(characteristics);

  // Add a small random component to ensure uniqueness even with identical devices
  // This random part is stored and reused
  const STORAGE_KEY = "entarat-device-random";
  let randomPart = localStorage.getItem(STORAGE_KEY);
  if (!randomPart) {
    randomPart = Math.random().toString(36).substring(2, 10);
    localStorage.setItem(STORAGE_KEY, randomPart);
  }

  return `device-${fingerprint}-${randomPart}`;
}

/**
 * Gets or generates a unique device ID for the current browser/device.
 * The device ID is based on device characteristics and stored in localStorage.
 * @returns A unique device ID string
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") {
    // Server-side: return a temporary ID (shouldn't happen in practice)
    return `device-server-${Date.now()}`;
  }

  const STORAGE_KEY = "entarat-device-id";
  let deviceId = localStorage.getItem(STORAGE_KEY);

  if (!deviceId) {
    // Generate a new device ID based on device fingerprint
    deviceId = generateDeviceFingerprint();
    localStorage.setItem(STORAGE_KEY, deviceId);
  }

  return deviceId;
}

/**
 * Gets or generates a unique player ID for the current device.
 * The player ID is based on the device ID and stored in localStorage.
 * This ensures the same device always has the same player ID until login is implemented.
 * @returns A unique player ID string
 */
export function getPlayerId(): string {
  if (typeof window === "undefined") {
    // Server-side: return a temporary ID (shouldn't happen in practice)
    return `player-server-${Date.now()}`;
  }

  const STORAGE_KEY = "entarat-player-id";
  let playerId = localStorage.getItem(STORAGE_KEY);

  if (!playerId) {
    // Generate a player ID based on device ID
    const deviceId = getDeviceId();
    // Create a hash from device ID to make it shorter and more consistent
    const hash = simpleHash(deviceId);
    playerId = `player-${hash}`;
    localStorage.setItem(STORAGE_KEY, playerId);
  }

  return playerId;
}
