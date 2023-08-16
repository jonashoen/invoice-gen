import db from "@/db";

const getCustomers = async (userId: number) => {
  return db.customer.findMany({
    where: {
      userId,
    },
  });
};

export default { getCustomers };
