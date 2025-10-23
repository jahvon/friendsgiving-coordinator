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
        <div className="min-h-screen bg-autumn-50">
          <header className="bg-harvest-700 shadow-lg border-b-4 border-harvest-800">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Friendsgiving Coordinator
              </h1>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
