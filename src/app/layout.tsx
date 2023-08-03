"use client";

import "@fontsource/lexend-mega";
import "@fontsource/lexend-mega/700.css";
import "@fontsource/lexend-mega/900.css";

import { QueryClient, QueryClientProvider } from "react-query";

import "./globals.css";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export const metadata = {
  title: "invoice-gen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
