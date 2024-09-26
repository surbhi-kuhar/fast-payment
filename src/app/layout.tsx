import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppbarClient } from "../components/AppbarClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // Import the CSS for Toastify
import { Providers } from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet",
  description: "Simple wallet app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <div className="min-w-screen min-h-screen bg-[#ebe6e6]">
            <AppbarClient />
            {children}
          </div>
          {/* ToastContainer to display notifications */}
          <ToastContainer />
        </body>
      </Providers>
    </html>
  );
}
