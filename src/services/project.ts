import db from "@/db";

const getProjects = async (userId: number) => {
  return db.project.findMany({
    where: {
      customer: {
        userId,
      },
    },
  });
};

export default { getProjects };
