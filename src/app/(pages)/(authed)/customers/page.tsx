import Header from "@/components/Header";
import AddCustomer from "@/modals/AddCustomer";
import Paper from "@/components/Paper";
import customer from "@/services/customer";
import isAuthed from "@/lib/isAuthed";
import ModalButton from "@/components/Button/ModalButton";

const metadata = { title: "Kunden - ig" };

const Customers = async () => {
  const userId = await isAuthed();
  const customers = await customer.getCustomers(userId!);

  return (
    <main>
      <Header title="Kunden">
        <ModalButton
          className="bg-pink text-white"
          modal={{
            title: "Kunden anlegen",
            content: <AddCustomer />,
          }}
        >
          Anlegen
        </ModalButton>
      </Header>

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
              <ModalButton
                modal={{
                  title: "Kunden bearbeiten",
                  content: (
                    <AddCustomer
                      id={customer.id}
                      hasProjects={customer._count.projects !== 0}
                      oldName={customer.name}
                      oldNumber={customer.number}
                      oldZipCode={customer.zipCode.toString()}
                      oldCity={customer.city}
                      oldStreet={customer.street}
                      oldHouseNumber={customer.houseNumber}
                    />
                  ),
                }}
              >
                Bearbeiten
              </ModalButton>
            </div>
          </Paper>
        ))}
      </div>
    </main>
  );
};

export default Customers;
export { metadata };
