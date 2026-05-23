import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanatan Dharm कला ( kalaa )",

  description:
    "Explore spiritual kalaa, divine aesthetics, cosmic visuals, wallpapers, sacred expression, Sanatan Dharma inspired art and cinematic devotional edits.",

  metadataBase: new URL("https://son-of-parvati-kalaa.vercel.app"),

  openGraph: {
    title: "Sanatan Dharm कला ( kalaa )",

    description:
      "A cinematic archive of divine aesthetics and sacred art.",

    url: "https://son-of-parvati-kalaa.vercel.app",

    siteName: "Sanatan Dharm कला",

    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
      },
    ],

    locale: "en_US",

    type: "website",
  },
  twitter: {

  card: "summary_large_image",

  title: "Sanatan Dharm कला ( kalaa )",

  description:
    "A cinematic archive of divine aesthetics and sacred art.",

  images: ["/icon.png"],
},

  icons: {
    icon: "/icon.png",
  },

  verification: {
    google: "LdDoFkVB5VrpSPJQw13BXnd_NxilRfUZA1NskNbwwG0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta
          name="p:domain_verify"
          content="8590f2f69cfa342f22e30e663acc8f66"
        />
      </head>

      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}