"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import AddProject from "./AddProject";
import Loader from "@/components/Loader";
import Paper from "@/components/Paper";
import { Customer, Project } from "@prisma/client";

const Projects = () => {
  const showModal = useModalStore((state) => state.show);

  const { data: projects, isFetching } = useApi<
    (Project & { customer: Customer })[]
  >({
    route: Api.Projects,
  });

  return (
    <main>
      <Header title="Projekte">
        <Button
          className="bg-pink text-white"
          onClick={() =>
            showModal({
              title: "Projekt anlegen",
              content: <AddProject />,
            })
          }
        >
          Anlegen
        </Button>
      </Header>

      {!isFetching ? (
        <div className="flex flex-col gap-4">
          {projects.length === 0 && (
            <p className="text-center text-3xl mt-20">
              Noch keine Projekte angelegt
            </p>
          )}
          {projects.map((project) => (
            <Paper key={project.id}>
              <div className="flex flex-row justify-between items-center">
                <div>
                  <p className="text-xl">{project.name}</p>
                  <p className="text-sm">{project.customer.name}</p>
                </div>
                <Button
                  onClick={() => {
                    showModal({
                      title: "Kunden bearbeiten",
                      content: (
                        <AddProject
                          id={project.id}
                          hasInvoices={
                            (project as any)["_count"].invoices !== 0
                          }
                          oldName={project.name}
                          oldPaymentDue={project.paymentDue.toString()}
                          oldPaymentDueUnit={project.paymentDueUnit}
                          oldCustomerId={project.customerId.toString()}
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

export default Projects;
