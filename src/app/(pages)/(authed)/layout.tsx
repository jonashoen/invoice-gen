import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Chip from "@/components/Chip";
import Link from "next/link";
import Pages from "@/routes/Pages";
import LogoutButton from "@/components/Button/LogoutButton";
import isAuthed from "@/lib/isAuthed";
import Navigation from "@/components/Navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  const authed = await isAuthed();

  if (!authed) {
    redirect(Pages.Login);
  }

  return (
    <div className="flex flex-grow items-center min-h-screen flex-col">
      <header className="flex  w-screen justify-center bg-purple py-4 border-b-8 border-black sticky top-0 z-40">
        <div className="container flex flex-wrap justify-center 2xl:justify-between items-center gap-4">
          <Link href={Pages.Invoices}>
            <Chip className="bg-orange -rotate-3">
              <h1 className="font-bold text-xl text-white">invoice-gen</h1>
            </Chip>
          </Link>
          <Navigation />
          <LogoutButton />
        </div>
      </header>
      <div className="container py-8">{children}</div>
    </div>
  );
};

export default Layout;
