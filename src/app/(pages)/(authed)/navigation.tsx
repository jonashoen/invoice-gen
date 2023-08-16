import Image from "next/image";
import Link from "next/link";

import DashboardIcon from "../../../../public/dashboard.svg";
import InvoiceIcon from "../../../../public/invoice.svg";
import ProjectIcon from "../../../../public/project.svg";
import CustomerIcon from "../../../../public/customer.svg";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { icon: DashboardIcon, text: "Dashboard", url: "/dashboard" },
  { icon: InvoiceIcon, text: "Rechnungen", url: "/invoices" },
  { icon: ProjectIcon, text: "Projekte", url: "/projects" },
  { icon: CustomerIcon, text: "Kunden", url: "/customers" },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col w-80 bg-purple_dark">
      <div className="flex justify-center my-12">
        <Image
          src={InvoiceIcon}
          alt="Logo"
          width={96}
          height={96}
          className="invert"
        />
      </div>
      <ul>
        {links.map((link) => {
          const isActiveRoute = pathname.includes(link.url);

          return (
            <li
              className={[
                "text-white text-l transition-colors duration-300 hover:bg-purple",
                isActiveRoute ? "bg-purple" : "",
              ].join(" ")}
            >
              <Link href={link.url} className="flex items-center gap-4 py-6">
                <Image
                  src={link.icon}
                  alt={link.text}
                  width={24}
                  height={24}
                  className="ml-10 invert"
                />
                <p>{link.text}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
