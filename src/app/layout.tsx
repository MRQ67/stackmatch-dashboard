import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StackMatch Dashboard - Streamline Your Development Workflow",
  description: "StackMatch helps developers manage, compare, and optimize their development environments with powerful tools and integrations.",
  keywords: ["development environment", "environment management", "developer tools", "DevOps", "environment comparison", "CLI tools", "team collaboration"],
  authors: [{ name: "StackMatch Team" }],
  creator: "StackMatch",
  publisher: "StackMatch",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stackmatch.aa3.site'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "StackMatch Dashboard - Streamline Your Development Workflow",
    description: "StackMatch helps developers manage, compare, and optimize their development environments with powerful tools and integrations.",
    url: 'https://stackmatch.aa3.site',
    siteName: 'StackMatch Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StackMatch Dashboard - Environment Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "StackMatch Dashboard - Streamline Your Development Workflow",
    description: "StackMatch helps developers manage, compare, and optimize their development environments with powerful tools and integrations.",
    images: ['/og-image.png'],
    creator: '@stackmatch',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://stackmatch.aa3.site/#organization",
        "name": "StackMatch",
        "url": "https://stackmatch.dev",
        "logo": {
          "@type": "ImageObject",
          "url": "https://stackmatch.aa3.site/logo.svg",
          "width": 512,
          "height": 512
        },
        "description": "StackMatch helps developers manage, compare, and optimize their development environments with powerful tools and integrations.",
        "foundingDate": "2024",
        "sameAs": [
          "https://github.com/MRQ67/stackmatch"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://stackmatch.aa3.site/#website",
        "url": "https://stackmatch.aa3.site",
        "name": "StackMatch Dashboard",
        "description": "Streamline Your Development Workflow with StackMatch - Environment Management Platform",
        "publisher": {
          "@id": "https://stackmatch.aa3.site/#organization"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://stackmatch.aa3.site/#software",
        "name": "StackMatch Dashboard",
        "description": "A comprehensive platform for managing, comparing, and optimizing development environments with powerful tools and integrations.",
        "url": "https://stackmatch.aa3.site",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "publisher": {
          "@id": "https://stackmatch.aa3.site/#organization"
        },
        "featureList": [
          "Environment Management",
          "Version Control Integration",
          "Security Features",
          "Analytics Dashboard",
          "Team Collaboration",
          "CLI Integration"
        ]
      }
    ]
  };

  return (
    <html lang="en" className="dark h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <NextTopLoader showSpinner={false} />
        <ToastProvider>
          <div className="flex-1">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}