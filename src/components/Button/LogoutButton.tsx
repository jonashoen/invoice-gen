"use client";

import Button from "@/components/Button";
import useApiMutation from "@/hooks/useApiMutation";
import Api from "@/routes/Api";
import Pages from "@/routes/Pages";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const LogoutButton: React.FC<Props> = (props) => {
  const router = useRouter();

  const logout = useApiMutation({
    route: Api.Logout,
    onSuccess: () => {
      router.replace(Pages.Login);
    },
  });

  return (
    <Button
      className="bg-white h-min"
      onClick={() => logout.mutate(null)}
      {...props}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
