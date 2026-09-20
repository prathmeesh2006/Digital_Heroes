import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Digital Heroes — Play Golf. Win Prizes. Change Lives.",
    template: "%s | Digital Heroes",
  },
  description:
    "A premium subscription platform combining golf performance tracking, monthly draw-based rewards, and charitable giving. Subscribe, play, and make a difference.",
  keywords: [
    "golf",
    "charity",
    "subscription",
    "prizes",
    "draw",
    "stableford",
    "digital heroes",
  ],
  openGraph: {
    title: "Digital Heroes — Play Golf. Win Prizes. Change Lives.",
    description:
      "Subscribe, track your golf scores, enter monthly draws, and support charities that matter.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
