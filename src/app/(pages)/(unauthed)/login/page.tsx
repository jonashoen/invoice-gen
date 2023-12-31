"use client";

import Paper from "@/components/Paper";
import TextField from "@/components/TextField";
import Button from "@/components/Button";

import Form from "@/components/Form";
import useApiMutation from "@/hooks/useApiMutation";
import Api from "@/routes/Api";
import { LoginRequest } from "@/interfaces/requests/user";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pages from "@/routes/Pages";
import useModalStore from "@/store/modalStore";
import ForgotPassword from "@/modals/ForgotPassword";
import { StatusCodes } from "http-status-codes";
import VerifyAccount from "@/modals/VerifyAccount";
import Info from "@/components/Info";

const Login = () => {
  const router = useRouter();

  const showModal = useModalStore((state) => state.show);

  const login = useApiMutation<LoginRequest>({
    route: Api.Login,
    onSuccess: () => {
      router.replace(Pages.Invoices);
    },
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.UNAUTHORIZED) {
        setError("Der Nutzername oder das Passwort ist falsch.");
      } else if (apiError.statusCode === StatusCodes.FORBIDDEN) {
        showModal({
          title: "Account verifizieren",
          content: <VerifyAccount username={username} />,
          cancelable: false,
        });
      } else {
        setError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
  });

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    login.mutate({ username, password });
  };

  return (
    <Form onSubmit={onSubmit}>
      <Paper className="gap-2 mt-10">
        <div className="flex justify-between items-center">
          <p className="font-bold py-4 text-4xl">Einloggen</p>
          <p>
            oder{" "}
            <Link className="underline" href={Pages.Register}>
              Registrieren
            </Link>
          </p>
        </div>

        {error && (
          <Info severity="error" className="mt-4">
            {error}
          </Info>
        )}

        <TextField
          name="username"
          value={username}
          setValue={setUsername}
          label="Nutzername"
          required
        />

        <TextField
          name="password"
          value={password}
          setValue={setPassword}
          label="Passwort"
          required
          type="password"
        />
        <p
          className="text-sm text-right cursor-pointer"
          onClick={() =>
            showModal({
              title: "Passwort vergessen",
              content: <ForgotPassword />,
            })
          }
        >
          <span>Probleme beim Einloggen?</span>{" "}
          <span className="text-purple underline">Passwort vergessen</span>
        </p>

        <div className="flex justify-end mt-4 ">
          <Button type="submit" className="bg-ice " loading={login.isLoading}>
            Login
          </Button>
        </div>
      </Paper>
    </Form>
  );
};

export default Login;
