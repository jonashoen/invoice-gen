import Header from "@/components/Header";
import Paper from "@/components/Paper";
import AddInvoice from "@/modals/AddInvoice";
import dateToDateString from "@/helper/dateToDateString";
import dayjs from "dayjs";
import CreateInvoice from "@/modals/CreateInvoice";
import ShowInvoice from "@/modals/ShowInvoice";
import Details from "@/components/Details";
import ModalButton from "@/components/Button/ModalButton";
import isAuthed from "@/lib/isAuthed";
import invoice from "@/services/invoice";

const metadata = { title: "Rechnungen - ig" };

const Invoices = async () => {
  const userId = await isAuthed();
  const invoices = await invoice.getInvoices(userId!);

  const openInvoices = invoices?.filter((invoice) => !invoice.locked);
  const createdInvoices = invoices?.filter((invoice) => invoice.locked);

  return (
    <main>
      <Header title="Rechnungen">
        <ModalButton
          className="bg-pink text-white"
          modal={{
            title: "Rechnung anlegen",
            content: <AddInvoice />,
          }}
        >
          Anlegen
        </ModalButton>
      </Header>

      <div className="flex flex-col gap-8">
        {invoices.length === 0 && (
          <p className="text-center text-3xl mt-20">
            Noch keine Rechnungen angelegt
          </p>
        )}
        {openInvoices && openInvoices.length !== 0 && (
          <Details title={`Offene (${openInvoices.length})`}>
            <div className="flex flex-col gap-4">
              {openInvoices.map((invoice) => (
                <Paper className="!flex-row justify-between" key={invoice.id}>
                  <div className="flex flex-col justify-center">
                    <p className="text-xl">
                      {invoice.number ??
                        `Draft vom ${dateToDateString(invoice.createdAt)}`}
                    </p>
                    <p>
                      <span className="text-lg">
                        {invoice.project.customer.name}
                      </span>{" "}
                      <span>({invoice.project.name})</span>
                    </p>
                  </div>
                  <div className="flex flex-col justify-between gap-2 items-end">
                    <ModalButton
                      modal={{
                        title: `Rechnung bearbeiten (vom ${dateToDateString(
                          invoice.createdAt
                        )})`,
                        content: (
                          <AddInvoice
                            id={invoice.id}
                            oldProjectId={invoice.projectId.toString()}
                            oldPositions={invoice.positions}
                          />
                        ),
                      }}
                    >
                      Bearbeiten
                    </ModalButton>

                    <ModalButton
                      className="bg-green"
                      modal={{
                        title: "Rechnung erstellen",
                        content: <CreateInvoice invoice={invoice} />,
                      }}
                    >
                      Erstellen
                    </ModalButton>
                  </div>
                </Paper>
              ))}
            </div>
          </Details>
        )}

        {createdInvoices && createdInvoices.length !== 0 && (
          <Details title={`Erstellte (${createdInvoices.length})`}>
            <div className="flex flex-col gap-4">
              {createdInvoices.map((invoice) => (
                <Paper key={invoice.id}>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-row justify-between items-center">
                      <div>
                        <p className="text-xl">
                          {invoice.number ??
                            `Draft vom ${dateToDateString(invoice.createdAt)}`}
                        </p>
                        <p>
                          <span className="text-lg">
                            {invoice.project.customer.name}
                          </span>{" "}
                          <span>({invoice.project.name})</span>
                        </p>

                        <p>
                          <span className="inline-block w-[210px]">
                            Rechnungsdatum:
                          </span>
                          <span>{dateToDateString(invoice.date!)}</span>
                        </p>
                        <p>
                          <span className="inline-block w-[210px]">
                            Zahlungsfrist:
                          </span>
                          <span>
                            {dateToDateString(
                              dayjs(invoice.date)
                                .add(
                                  invoice.project.paymentDue,
                                  invoice.project.paymentDueUnit
                                )
                                .toDate()
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-end">
                      <ModalButton
                        type="button"
                        modal={{
                          title: `Rechnung ${invoice.number}`,
                          content: (
                            <ShowInvoice
                              filename={invoice.filename!}
                              number={invoice.number!}
                            />
                          ),
                        }}
                      >
                        Anzeigen
                      </ModalButton>
                    </div>
                  </div>
                </Paper>
              ))}
            </div>
          </Details>
        )}
      </div>
    </main>
  );
};

export default Invoices;
export { metadata };
