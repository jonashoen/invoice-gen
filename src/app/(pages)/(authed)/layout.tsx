"use client";

import title from "@/lib/title";
import { ReactNode, useEffect } from "react";
import Header from "./header";
import Navigation from "./navigation";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";

const { metadata, layout } = title("Dashboard - ig");

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const isAuthed = useUserStore((state) => state.isAuthed);

  useEffect(() => {
    if (isAuthed === false) {
      router.push("/login");
    }
  }, [isAuthed]);

  return (
    isAuthed && (
      <div className="flex flex-row">
        <Navigation />
        <div className="flex flex-grow min-h-screen flex-col">
          <Header />
          <div className="p-6">{layout({ children })}</div>
        </div>
      </div>
    )
  );
};

export default Layout;
export { metadata };
