import Modal from "@/components/Modal";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Modal />
    </>
  );
};

export default Layout;
