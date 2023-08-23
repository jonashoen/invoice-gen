"use client";

import title from "@/lib/title";
import { ReactNode, useEffect } from "react";
import useUserStore from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";
import Chip from "@/components/Chip";
import Link from "next/link";
import Button from "@/components/Button";
import Api from "@/routes/Api";
import useApiMutation from "@/hooks/useApiMutation";
import Pages from "@/routes/Pages";

const { metadata, layout } = title("Dashboard - ig");

const links = [
  { text: "Rechnungen", url: Pages.Invoices },
  { text: "Projekte", url: Pages.Projects },
  { text: "Kunden", url: Pages.Customers },
  { text: "Profil", url: Pages.Profile },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const logoutLocal = useUserStore((state) => state.logout);

  const logout = useApiMutation({
    route: Api.Logout,
    onSuccess: () => {
      router.replace(Pages.Login);
      logoutLocal();
    },
  });

  const isAuthed = useUserStore((state) => state.isAuthed);

  useEffect(() => {
    if (isAuthed === false) {
      router.push(Pages.Login);
    }
  }, [isAuthed]);

  return (
    isAuthed && (
      <div
        className={["flex flex-grow items-center min-h-screen flex-col"].join(
          " "
        )}
      >
        <header className="flex  w-screen justify-center bg-purple py-4 border-b-8 border-black sticky top-0 z-40">
          <div className="container flex flex-wrap justify-center 2xl:justify-between items-center gap-4">
            <Link href={Pages.Invoices}>
              <Chip className="bg-orange -rotate-3">
                <h1 className="font-bold text-xl text-white">invoice-gen</h1>
              </Chip>
            </Link>
            <nav className="flex flex-grow flex-wrap justify-around items-center px-32 gap-4">
              {links.map((link) => {
                const isActiveRoute = pathname.includes(link.url);

                return (
                  <Link
                    key={link.text}
                    href={link.url}
                    className={[
                      "box-content text-white text-xl transition-sizes duration-300",
                      isActiveRoute
                        ? "underline cursor-default"
                        : "hover:underline",
                    ].join(" ")}
                  >
                    <p>{link.text}</p>
                  </Link>
                );
              })}
            </nav>
            <Button
              onClick={() => logout.mutate(null)}
              className="bg-white h-min"
            >
              Logout
            </Button>
          </div>
        </header>
        <div className="container py-8">{layout({ children })}</div>
      </div>
    )
  );
};

export default Layout;
export { metadata };
