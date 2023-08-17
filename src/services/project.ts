import db from "@/db";
import { PaymentDueUnit } from "@prisma/client";

const getProjects = async (userId: number) => {
  return db.project.findMany({
    where: {
      customer: {
        userId,
      },
    },
    include: {
      _count: {
        select: {
          invoices: true,
        },
      },
      customer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
};

const add = async (
  userId: number,
  {
    name,
    paymentDue,
    paymentDueUnit,
    customerId,
  }: {
    name: string;
    paymentDue: number;
    paymentDueUnit: PaymentDueUnit;
    customerId: number;
  }
) => {
  const customer = await db.customer.findUnique({
    where: {
      id: customerId,
      userId,
    },
  });

  if (!customer) {
    return null;
  }

  const projectName = await db.project.findUnique({
    where: {
      name_customerId: {
        name,
        customerId,
      },
    },
  });

  if (projectName) {
    return null;
  }

  return await db.project.create({
    data: {
      name,
      paymentDue,
      paymentDueUnit,
      customerId,
    },
  });
};

const edit = async (
  userId: number,
  {
    id,
    name,
    paymentDue,
    paymentDueUnit,
    customerId,
  }: {
    id: number;
    name?: string;
    paymentDue?: number;
    paymentDueUnit?: PaymentDueUnit;
    customerId?: number;
  }
) => {
  if (customerId) {
    const customer = await db.customer.findUnique({
      where: {
        id: customerId,
        userId,
      },
    });

    if (!customer) {
      return null;
    }
  }

  const project = await db.project.findUnique({
    where: {
      id,
    },
  });

  if (!project) {
    return null;
  }

  if (name && project.name !== name) {
    const projectName = await db.project.findUnique({
      where: {
        name_customerId: {
          name,
          customerId: project.customerId,
        },
      },
    });

    if (projectName) {
      return null;
    }
  }

  return await db.project.update({
    where: {
      id,
    },
    data: {
      name,
      paymentDue,
      paymentDueUnit,
      customerId,
    },
  });
};

const deleteProject = async (userId: number, { id }: { id: number }) => {
  const project = await db.project.findFirst({
    where: {
      id,
      customer: {
        userId,
      },
    },
    include: {
      _count: {
        select: {
          invoices: true,
        },
      },
    },
  });

  if (!project || project._count.invoices !== 0) {
    return null;
  }

  return await db.project.delete({
    where: {
      id,
    },
  });
};

export default { getProjects, add, edit, deleteProject };
