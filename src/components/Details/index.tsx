"use client";

import { DetailsHTMLAttributes, useState } from "react";
import Button from "../Button";
import Container from "../Container";

interface Props extends DetailsHTMLAttributes<HTMLDetailsElement> {
  title: string;
}

const Details: React.FC<Props> = ({ title, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <details open={isOpen} {...props}>
      <summary
        className="flex items-center gap-2 w-fit list-none select-none"
        onClick={(e) => e.preventDefault()}
      >
        <Container className="w-fit bg-purple gap-2">
          <h3 className="text-xl text-white">{title}</h3>
        </Container>
        <Button
          className={[
            "transition-colors !w-[48px] !h-[48px] text-center",
            isOpen ? "bg-red-600 text-white" : "bg-green",
          ].join(" ")}
          onClick={() => setIsOpen((o) => !o)}
        >
          {isOpen ? "-" : "+"}
        </Button>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
};

export default Details;
