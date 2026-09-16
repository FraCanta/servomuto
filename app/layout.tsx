import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";
const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const serif = Playfair_Display({ variable: "--font-serif", subsets: ["latin"], style: ["normal", "italic"] });
export const metadata: Metadata = { metadataBase: new URL("https://www.servomuto.it"), title: { default: "SERVOMUTO — Light, tailored.", template: "%s — SERVOMUTO" }, description: "Handcrafted lighting design from Milan.", openGraph: { type: "website", siteName: "SERVOMUTO", locale: "en_US" }, twitter: { card: "summary_large_image" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><Header /><div id="main-content">{children}</div><Footer /></body></html>; }
