"use client";

import Modal from "@/components/Modal";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";
import useUserStore from "@/store/userStore";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const [login, logout] = useUserStore((state) => [state.login, state.logout]);

  useApi({
    route: Api.Authed,
    onSuccess: login,
    onError: logout,
  });

  return (
    <>
      {children}
      <Modal />
    </>
  );
};

export default Layout;
