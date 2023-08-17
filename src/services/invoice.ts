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
    include: {
      project: {
        select: {
          name: true,
          paymentDue: true,
          paymentDueUnit: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
      },
      positions: true,
    },
  });
};

export default { getInvoices };
