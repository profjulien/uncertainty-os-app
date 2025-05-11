// app/layout.tsx
import "./globals.css";                   // you can keep this or remove if unused
import React from "react";

export const metadata = {
  title: "Uncertainty-OS Sandbox",
  description: "Kernel demo with AI mentor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
