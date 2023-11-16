import Header from "@/components/Header";
import AddProject from "@/modals/AddProject";
import Paper from "@/components/Paper";
import group from "@/helper/groupArray";
import Details from "@/components/Details";
import t from "@/i18n/t";
import project from "@/services/project";
import isAuthed from "@/lib/isAuthed";
import ModalButton from "@/components/Button/ModalButton";

const metadata = { title: "Projekte - ig" };

const Projects = async () => {
  const userId = await isAuthed();
  const projects = await project.getProjects(userId!);
  const groupedProjects = group(projects, { cb: (i) => i.customer.name });

  return (
    <main>
      <Header title="Projekte">
        <ModalButton
          className="bg-pink text-white"
          modal={{
            title: "Projekt anlegen",
            content: <AddProject />,
          }}
        >
          Anlegen
        </ModalButton>
      </Header>

      <div className="flex flex-col gap-4">
        {projects.length === 0 && (
          <p className="text-center text-3xl mt-20">
            Noch keine Projekte angelegt
          </p>
        )}
        {Object.keys(groupedProjects).map((group) => (
          <Details key={group} title={group}>
            <div className="flex flex-col gap-4">
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
                    <ModalButton
                      modal={{
                        title: "Projekt bearbeiten",
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
                            oldArchived={project.archived}
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
          </Details>
        ))}
      </div>
    </main>
  );
};

export default Projects;
export { metadata };
