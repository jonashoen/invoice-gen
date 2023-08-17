import db from "@/db";

const getCustomers = async (userId: number) => {
  return db.customer.findMany({
    where: {
      userId,
    },
    orderBy: {
      id: "asc",
    },
    include: {
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });
};

const addCustomer = async (
  userId: number,
  {
    name,
    number,
    zipCode,
    city,
    street,
    houseNumber,
  }: {
    name: string;
    number: string;
    zipCode: string;
    city: string;
    street: string;
    houseNumber: string;
  }
) => {
  const oldCustomer = await db.customer.findFirst({
    where: {
      OR: [
        {
          name,
          userId,
        },
        {
          number,
          userId,
        },
      ],
    },
  });

  if (oldCustomer) {
    return null;
  }

  return await db.customer.create({
    data: {
      userId,
      name,
      number,
      zipCode,
      city,
      street,
      houseNumber,
    },
  });
};

const editCustomer = async (
  userId: number,
  {
    id,
    name,
    number,
    zipCode,
    city,
    street,
    houseNumber,
  }: {
    id: number;
    name?: string;
    number?: string;
    zipCode?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
  }
) => {
  const oldCustomer = await db.customer.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!oldCustomer) {
    return null;
  }

  if (name && name !== oldCustomer.name) {
    const oldCustomerName = await db.customer.findUnique({
      where: {
        name_userId: {
          name,
          userId,
        },
      },
    });

    if (oldCustomerName) {
      return null;
    }
  }

  if (number && number !== oldCustomer.number) {
    const oldCustomerNumber = await db.customer.findUnique({
      where: {
        number_userId: {
          number,
          userId,
        },
      },
    });

    if (oldCustomerNumber) {
      return null;
    }
  }

  return await db.customer.update({
    where: {
      id,
      userId,
    },
    data: {
      name,
      number,
      zipCode,
      city,
      street,
      houseNumber,
    },
  });
};

const deleteCustomer = async (userId: number, { id }: { id: number }) => {
  const customer = await db.customer.findUnique({
    where: {
      id,
      userId,
    },
    include: {
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });

  if (!customer || customer._count.projects !== 0) {
    return null;
  }

  return await db.customer.delete({
    where: {
      id,
      userId,
    },
  });
};

export default { getCustomers, addCustomer, editCustomer, deleteCustomer };
