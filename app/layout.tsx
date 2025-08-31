import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { FirebaseAuthProvider } from "./context/FirebaseAuthContext";
import { FirebaseFirestoreProvider } from "./context/FirebaseFirestoreContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { VotingControlProvider } from "./context/VotingControlContext";
import { LeaderboardVisibilityProvider } from "./context/LeaderboardVisibilityContext";
import FirebaseErrorBoundary from "./components/FirebaseErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cre'oVate 2025 - Ideathon Voting Platform",
  description: "Igniting Creativity, Driving Innovations - Join the most innovative ideathon event of 2025. Register your team, present your ideas, and vote for the best projects. Powered by cutting-edge technology and creative minds.",
  keywords: ["ideathon", "innovation", "voting", "tech", "startup", "competition", "2025", "Cre'oVate"],
  authors: [{ name: "Cre'oVate Team" }],
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  openGraph: {
    title: "Cre'oVate 2025 - Ideathon Voting Platform",
    description: "Igniting Creativity, Driving Innovations - Join the most innovative ideathon event of 2025. Register your team, present your ideas, and vote for the best projects.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cre'oVate 2025 - Ideathon Voting Platform",
    description: "Igniting Creativity, Driving Innovations - Join the most innovative ideathon event of 2025. Register your team, present your ideas, and vote for the best projects.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FirebaseErrorBoundary>
          <FirebaseAuthProvider>
            <FirebaseFirestoreProvider>
              <AdminAuthProvider>
                <VotingControlProvider>
                  <LeaderboardVisibilityProvider>
                    <Header />
                    <main>{children}</main>
                  </LeaderboardVisibilityProvider>
                </VotingControlProvider>
              </AdminAuthProvider>
            </FirebaseFirestoreProvider>
          </FirebaseAuthProvider>
        </FirebaseErrorBoundary>
      </body>
    </html>
  );
}
