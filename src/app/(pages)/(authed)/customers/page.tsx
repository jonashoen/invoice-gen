"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";

const Customers = () => {
  const { data: customers } = useApi({ route: Api.Customers, initialData: [] });

  return (
    <main>
      <Header title="Kunden">
        <Button className="bg-pink text-white">+ Anlegen</Button>
      </Header>

      <p>{JSON.stringify(customers)}</p>
    </main>
  );
};

export default Customers;
