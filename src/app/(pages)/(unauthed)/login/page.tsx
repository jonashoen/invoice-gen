"use client";

import Container from "@/components/Container";
import Paper from "@/components/Paper";
import TextField from "@/components/TextField";
import Button from "@/components/Button";

import Form from "@/components/Form";
import useApiMutation from "@/hooks/useApiMutation";
import Api from "@/routes/Api";
import LoginRequest from "@/interfaces/requests/login";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/userStore";

const Login = () => {
  const router = useRouter();

  const loginLocal = useUserStore((state) => state.login);

  const login = useApiMutation<LoginRequest>({
    route: Api.Login,
    onSuccess: () => {
      loginLocal();
      router.replace("/dashboard");
    },
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    login.mutate({ username, password });
  };

  return (
    <Form onSubmit={onSubmit}>
      <Paper className="gap-2 bg-white mt-10">
        <div className="flex justify-between items-center">
          <p className="font-bold py-4 text-4xl">Einloggen</p>
          <p>
            oder{" "}
            <Link className="underline" href="/register">
              Registrieren
            </Link>
          </p>
        </div>

        <TextField
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="text-purple"
          label="Nutzername"
          required
        />

        <TextField
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-purple"
          label="Passwort"
          required
          type="password"
        />
        <p className="text-sm text-right">
          Probleme beim Einloggen?{" "}
          <Link href="#" className="text-purple underline">
            Passwort vergessen
          </Link>
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
