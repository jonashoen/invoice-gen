"use client";

import Modal from "@/components/Modal";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";
import Pages from "@/routes/Pages";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [login, logout] = useUserStore((state) => [state.login, state.logout]);

  useApi({
    route: Api.Authed,
    onSuccess: login,
    onError: () => {
      logout();
      router.push(Pages.Login);
    },
  });

  return (
    <>
      {children}
      <Modal />
    </>
  );
};

export default Layout;
