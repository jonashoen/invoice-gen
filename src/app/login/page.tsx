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

const Login = () => {
  const login = useApiMutation<LoginRequest, any>({
    route: Api.Login,
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    login.mutate({ username, password });
  };

  return (
    <main className="h-full bg-yellow">
      <Form
        onSubmit={onSubmit}
        className="container mx-auto h-screen flex flex-col justify-center"
      >
        <Container className="bg-green">
          <p className="font-bold py-4 text-6xl flex justify-between">
            <span>invoice-gen</span>
            <span>v0.0.1</span>
          </p>
        </Container>

        <Paper className="gap-2 bg-white mt-10">
          <div className="flex justify-between items-center">
            <p className="font-bold py-4 text-4xl">Einloggen</p>
            <p>
              oder{" "}
              <a className="underline" href="/register">
                Registrieren
              </a>
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
            <a href="#" className="text-purple underline">
              Passwort vergessen
            </a>
          </p>

          <div className="flex justify-end mt-4 ">
            <Button type="submit" className="bg-ice " loading={login.isLoading}>
              Login
            </Button>
          </div>
        </Paper>
      </Form>
    </main>
  );
};

export default Login;
