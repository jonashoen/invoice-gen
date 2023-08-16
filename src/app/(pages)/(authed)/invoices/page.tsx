"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";

const Pages = () => {
  const { data: invoices } = useApi({ route: Api.Invoices, initialData: [] });

  return (
    <main>
      <Header title="Rechnungen">
        <Button className="bg-pink text-white">+ Anlegen</Button>
      </Header>
      <p>{JSON.stringify(invoices)}</p>
    </main>
  );
};

export default Pages;
