"use client";

import Container from "@/components/Container";
import Paper from "@/components/Paper";

import Form from "@/components/Form";
import Link from "next/link";

const Dashboard = () => {
  return (
    <main className="bg-yellow flex-grow px-4">
      <Form className="container mx-auto flex flex-col justify-center">
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
              <Link className="underline" href="/register">
                Registrieren
              </Link>
            </p>
          </div>
        </Paper>
      </Form>
    </main>
  );
};

export default Dashboard;
