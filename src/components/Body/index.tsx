"use client";

import { HTMLAttributes } from "react";
import { Lexend_Mega } from "next/font/google";
import useModalStore from "@/store/modalStore";

const lexendMega = Lexend_Mega({
  subsets: ["latin"],
  display: "swap",
});

interface Props extends HTMLAttributes<HTMLButtonElement> {}

const Body: React.FC<Props> = ({ children }) => {
  const modalOpen = useModalStore((state) => state.open);

  return (
    <body
      className={[
        "bg-yellow",
        lexendMega.className,
        modalOpen && "overflow-clip",
      ].join(" ")}
    >
      {children}
    </body>
  );
};

export default Body;
