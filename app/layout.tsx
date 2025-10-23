import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Friendsgiving Coordinator",
  description: "Coordinate your Friendsgiving dishes and guests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-cream-100">
          {children}
        </div>
      </body>
    </html>
  );
}
