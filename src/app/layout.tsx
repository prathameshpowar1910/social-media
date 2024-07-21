import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/app/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/toaster";
import { AuthButton } from "@/components/AuthButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: 'ImageShare',
  description: 'Upload and share your photos',
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )
      }>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <div className="flex flex-col min-h-screen">
            <header className="container mx-auto p-4">
              <div className="flex justify-between items-center">
                <Button variant="link" className="text-4xl font-bold hover:underline cursor-pointer">
                  <Link href="/dashboard">
                    ImageShare
                  </Link>
                </Button>

                <div className="flex items-center space-x-4">
                  <AuthButton />
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="flex-grow container mx-auto p-4">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}