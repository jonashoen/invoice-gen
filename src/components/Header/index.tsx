import { ReactNode } from "react";

const Header = ({ children }: { children: ReactNode }) => {
  return <h1 className="text-6xl font-bold">{children}</h1>;
};

export default Header;
