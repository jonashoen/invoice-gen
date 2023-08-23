"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import AddCustomer from "./AddCustomer";
import { Customer } from "@prisma/client";
import Paper from "@/components/Paper";
import Loader from "@/components/Loader";

const Customers = () => {
  const showModal = useModalStore((state) => state.show);

  const { data: customers, isFetching } = useApi<Customer[]>({
    route: Api.Customers,
  });

  return (
    <main>
      <Header title="Kunden">
        <Button
          className="bg-pink text-white"
          onClick={() =>
            showModal({
              title: "Kunden anlegen",
              content: <AddCustomer />,
            })
          }
        >
          Anlegen
        </Button>
      </Header>

      {!isFetching ? (
        <div className="flex flex-col gap-4">
          {customers.length === 0 && (
            <p className="text-center text-3xl mt-20">
              Noch keine Kunden angelegt
            </p>
          )}
          {customers.map((customer) => (
            <Paper key={customer.id}>
              <div className="flex flex-row justify-between items-center">
                <div>
                  <p>
                    <span className="text-xl">{customer.name}</span>{" "}
                    <span className="font-black">{customer.number}</span>
                  </p>
                  <p className="text-sm">
                    <span>{customer.zipCode}</span> <span>{customer.city}</span>
                  </p>
                  <p className="text-sm">
                    <span>{customer.street}</span>{" "}
                    <span>{customer.houseNumber}</span>
                  </p>
                </div>
                <Button
                  onClick={() => {
                    showModal({
                      title: "Kunden bearbeiten",
                      content: (
                        <AddCustomer
                          id={customer.id}
                          hasProjects={
                            (customer as any)["_count"].projects !== 0
                          }
                          oldName={customer.name}
                          oldNumber={customer.number}
                          oldZipCode={customer.zipCode.toString()}
                          oldCity={customer.city}
                          oldStreet={customer.street}
                          oldHouseNumber={customer.houseNumber}
                        />
                      ),
                    });
                  }}
                >
                  Bearbeiten
                </Button>
              </div>
            </Paper>
          ))}
        </div>
      ) : (
        <Loader />
      )}
    </main>
  );
};

export default Customers;
