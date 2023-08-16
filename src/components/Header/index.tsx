import { ReactNode } from "react";
import Paper from "../Paper";
import Container from "../Container";

const Header = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => {
  return (
    <div className="flex justify-between items-center">
      <Container className="w-min bg-green">
        <h1 className="text-6xl font-bold">{title}</h1>
      </Container>
      {children}
    </div>
  );
};

export default Header;
