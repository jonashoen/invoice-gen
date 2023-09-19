"use client";

import Button from "@/components/Button";
import useModalStore from "@/store/modalStore";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  modal: {
    title: string;
    content: ReactNode;
  };
}

const ModalButton: React.FC<Props> = ({ children, modal, ...props }) => {
  const showModal = useModalStore((state) => state.show);

  return (
    <Button onClick={() => showModal(modal)} {...props}>
      {children}
    </Button>
  );
};

export default ModalButton;
