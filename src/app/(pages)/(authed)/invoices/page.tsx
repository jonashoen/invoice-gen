"use client";

import Header from "@/components/Header";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";

const Pages = () => {
  const { data: invoices } = useApi({ route: Api.Invoices, initialData: [] });

  return (
    <main>
      <Header>Rechnungen</Header>
      <p>{JSON.stringify(invoices)}</p>
    </main>
  );
};

export default Pages;
