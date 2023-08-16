"use client";

import Container from "@/components/Container";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const isAuthed = useUserStore((state) => state.isAuthed);

  useEffect(() => {
    if (isAuthed) {
      router.push("/dashboard");
    }
  }, [isAuthed]);

  return (
    isAuthed === false && (
      <main className="bg-yellow mx-auto h-screen flex flex-col justify-center">
        <div className="container flex flex-col mx-auto gap-20">
          <Container className="bg-green">
            <p className="font-bold py-4 text-6xl flex justify-between">
              <span>invoice-gen</span>
              <span>v0.0.1</span>
            </p>
          </Container>
          {children}
        </div>
      </main>
    )
  );
};

export default Layout;
