"use client";

import Header from "@/components/Header";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";

const Customers = () => {
  const { data: customers } = useApi({ route: Api.Customers, initialData: [] });

  return (
    <main>
      <Header>Kunden</Header>
      <p>{JSON.stringify(customers)}</p>
    </main>
  );
};

export default Customers;
