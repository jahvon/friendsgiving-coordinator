import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jahvon's Friendsgiving Invitation",
  description: "Interactive friendsgiving invitation and coordinator",
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
