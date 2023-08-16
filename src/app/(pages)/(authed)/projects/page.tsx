"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";

const Projects = () => {
  const { data: projects } = useApi({ route: Api.Projects, initialData: [] });

  return (
    <main>
      <Header title="Projekte">
        <Button className="bg-pink text-white">+ Anlegen</Button>
      </Header>
      <p>{JSON.stringify(projects)}</p>
    </main>
  );
};

export default Projects;
