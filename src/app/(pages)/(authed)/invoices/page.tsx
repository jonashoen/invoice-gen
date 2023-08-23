"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Paper from "@/components/Paper";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import { Customer, Invoice, InvoicePosition, Project } from "@prisma/client";
import AddInvoice from "./AddInvoice";
import dateToDateString from "@/helper/dateToDateString";
import dayjs from "dayjs";
import CreateInvoice from "./CreateInvoice";
import ShowInvoice from "./ShowInvoice";
import Container from "@/components/Container";
import { useState } from "react";

const Pages = () => {
  const showModal = useModalStore((state) => state.show);

  const { data: invoices, isFetching } = useApi<
    (Invoice & {
      project: Project & { customer: Customer };
      positions: InvoicePosition[];
    })[]
  >({
    route: Api.Invoices,
  });

  const [openInvoicesOpen, setOpenInvoicesOpen] = useState(true);
  const [createdInvoicesOpen, setCreatedInvoicesOpen] = useState(true);

  const openInvoices = invoices?.filter((invoice) => !invoice.locked);
  const createdInvoices = invoices?.filter((invoice) => invoice.locked);

  return (
    <main>
      <Header title="Rechnungen">
        <Button
          className="bg-pink text-white"
          onClick={() =>
            showModal({
              title: "Rechnung anlegen",
              content: <AddInvoice />,
            })
          }
        >
          Anlegen
        </Button>
      </Header>

      {!isFetching ? (
        <div className="flex flex-col gap-8">
          {invoices.length === 0 && (
            <p className="text-center text-3xl mt-20">
              Noch keine Rechnungen angelegt
            </p>
          )}
          {openInvoices && openInvoices.length !== 0 && (
            <details open>
              <summary
                className="cursor-pointer w-fit list-none select-none"
                onClick={() => setOpenInvoicesOpen((o) => !o)}
              >
                <Container className="w-fit flex items-center bg-purple gap-2">
                  <h3 className="text-xl text-white">
                    Offene ({openInvoices.length})
                  </h3>
                  <Container
                    className={[
                      "transition-colors !w-[48px] !h-[48px] text-center",
                      openInvoicesOpen ? "bg-red-600 text-white" : "bg-green",
                    ].join(" ")}
                  >
                    {openInvoicesOpen ? "-" : "+"}
                  </Container>
                </Container>
              </summary>
              <div className="flex flex-col gap-4 mt-4">
                {openInvoices.map((invoice) => (
                  <Paper className="!flex-row justify-between">
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
                      <Button
                        onClick={() => {
                          showModal({
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
                          });
                        }}
                      >
                        Bearbeiten
                      </Button>

                      <Button
                        className="bg-green"
                        onClick={() => {
                          showModal({
                            title: "Rechnung erstellen",
                            content: <CreateInvoice invoice={invoice} />,
                          });
                        }}
                      >
                        Erstellen
                      </Button>
                    </div>
                  </Paper>
                ))}
              </div>
            </details>
          )}

          {createdInvoices && createdInvoices.length !== 0 && (
            <details open>
              <summary
                className="cursor-pointer w-fit list-none select-none"
                onClick={() => setCreatedInvoicesOpen((o) => !o)}
              >
                <Container className="w-fit flex items-center bg-purple gap-2">
                  <h3 className="text-xl text-white">
                    Erstellte ({createdInvoices.length})
                  </h3>
                  <Container
                    className={[
                      "transition-colors !w-[48px] !h-[48px] text-center",
                      createdInvoicesOpen
                        ? "bg-red-600 text-white"
                        : "bg-green",
                    ].join(" ")}
                  >
                    {createdInvoicesOpen ? "-" : "+"}
                  </Container>
                </Container>
              </summary>
              <div className="flex flex-col gap-4 mt-4">
                {createdInvoices.map((invoice) => (
                  <Paper key={invoice.id}>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-row justify-between items-center">
                        <div>
                          <p className="text-xl">
                            {invoice.number ??
                              `Draft vom ${dateToDateString(
                                invoice.createdAt
                              )}`}
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
                        <Button
                          type="button"
                          onClick={() => {
                            showModal({
                              title: `Rechnung ${invoice.number}`,
                              content: (
                                <ShowInvoice
                                  filename={invoice.filename!}
                                  number={invoice.number!}
                                />
                              ),
                            });
                          }}
                        >
                          Anzeigen
                        </Button>
                      </div>
                    </div>
                  </Paper>
                ))}
              </div>
            </details>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </main>
  );
};

export default Pages;
