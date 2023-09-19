"use client";

import Pages from "@/routes/Pages";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { text: "Rechnungen", url: Pages.Invoices },
  { text: "Zeiterfassung", url: Pages.TimeTracking },
  { text: "Projekte", url: Pages.Projects },
  { text: "Kunden", url: Pages.Customers },
  { text: "Profil", url: Pages.Profile },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-grow flex-wrap justify-around items-center px-32 gap-4">
      {links.map((link) => {
        const isActiveRoute = pathname.includes(link.url);

        return (
          <Link
            key={link.text}
            href={link.url}
            className={[
              "box-content text-white text-xl transition-sizes duration-300",
              isActiveRoute ? "underline cursor-default" : "hover:underline",
            ].join(" ")}
          >
            <p>{link.text}</p>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
