import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "./theme-script";
import "./globals.css";

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Entarat - The Modern Way to Play",
  description:
    "Entarat is the modern way to play. It's a platform for playing games with your friends and family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${baloo2.variable} antialiased`}>
        <ThemeScript />
        <ThemeProvider defaultTheme="dark" storageKey="entarat-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
