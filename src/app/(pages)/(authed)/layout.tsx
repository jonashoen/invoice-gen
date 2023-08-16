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

const { metadata, layout } = title("Dashboard - ig");

const links = [
  { text: "Dashboard", url: "/dashboard" },
  { text: "Rechnungen", url: "/invoices" },
  { text: "Projekte", url: "/projects" },
  { text: "Kunden", url: "/customers" },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const logoutLocal = useUserStore((state) => state.logout);

  const logout = useApiMutation({
    route: Api.Logout,
    onSuccess: () => {
      router.replace("/login");
      logoutLocal();
    },
  });

  const isAuthed = useUserStore((state) => state.isAuthed);

  useEffect(() => {
    if (isAuthed === false) {
      router.push("/login");
    }
  }, [isAuthed]);

  return (
    isAuthed && (
      <div className="flex flex-grow items-center min-h-screen flex-col">
        <header className="flex w-screen justify-center bg-purple py-4">
          <div className="container flex justify-between items-center ">
            <Chip className="bg-orange -rotate-3">
              <h1 className="font-bold text-xl text-white">invoice-gen</h1>
            </Chip>
            <nav className="flex flex-grow justify-around items-center px-32">
              {links.map((link) => {
                const isActiveRoute = pathname.includes(link.url);

                return (
                  <Link
                    href={link.url}
                    className={[
                      "box-content text-white text-xl transition-sizes duration-300 hover:font-black",
                      isActiveRoute ? "font-black text-2xl" : "",
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
