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
import { useState } from "react";
import group from "@/helper/groupArray";
import Details from "@/components/Details";
import t from "@/i18n/t";

const Projects = () => {
  const showModal = useModalStore((state) => state.show);

  const { data: projects, isFetching } = useApi<
    (Project & { customer: Customer })[]
  >({
    route: Api.Projects,
    onSuccess(data) {
      const grouped = group(data, { cb: (i) => i.customer.name });

      setGroupedProjects(grouped);
    },
  });

  const [groupedProjects, setGroupedProjects] = useState<{
    [key: string]: typeof projects;
  }>({});

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
          {Object.keys(groupedProjects).map((group) => (
            <Details key={group} title={group}>
              {groupedProjects[group].map((project) => (
                <Paper key={project.id}>
                  <div className="flex flex-row justify-between items-center">
                    <div>
                      <p className="text-xl">{project.name}</p>
                      <p className="text-sm">
                        <span>Zahlungsziel:</span>{" "}
                        <span>
                          {project.paymentDue} {t(project.paymentDueUnit)}
                        </span>
                      </p>
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
            </Details>
          ))}
        </div>
      ) : (
        <Loader />
      )}
    </main>
  );
};

export default Projects;
