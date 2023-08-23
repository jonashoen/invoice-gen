import { ReactNode } from "react";
import Container from "../Container";

const Header = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
      <Container className="w-min bg-green">
        <h1 className="text-6xl font-bold">{title}</h1>
      </Container>
      {children}
    </div>
  );
};

export default Header;
