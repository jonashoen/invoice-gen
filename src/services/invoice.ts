import db from "@/db";

const getInvoices = async (userId: number) => {
  return db.invoice.findMany({
    where: {
      project: {
        customer: {
          userId,
        },
      },
    },
  });
};

export default { getInvoices };
