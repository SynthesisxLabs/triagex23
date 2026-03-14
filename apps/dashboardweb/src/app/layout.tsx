import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/(frontend)/Navbar/Navbar";
import Footer from "@/(frontend)/Footer/Footer";
export const metadata: Metadata = {
  title: "triageX | The AI-Powered Healthcare OS",
  description: "triageX unifies patient care, emergency logistics, and hospital administration into a single autonomous platform.",
};

import SmoothScroll from "@/(frontend)/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
