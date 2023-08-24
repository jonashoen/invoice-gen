"use client";

import "@fontsource/lexend-mega";
import "@fontsource/lexend-mega/700.css";
import "@fontsource/lexend-mega/900.css";

import { QueryClient, QueryClientProvider } from "react-query";

import "./globals.css";
import useModalStore from "@/store/modalStore";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modalOpen = useModalStore((state) => state.open);

  return (
    <html lang="de">
      <body className={["bg-yellow", modalOpen && "overflow-hidden"].join(" ")}>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
