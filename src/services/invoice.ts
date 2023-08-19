import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import db from "@/db";
import { InvoicePositionUnit } from "@prisma/client";
import pdf from "@/services/pdf";

dayjs.extend(utc);

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
      positions: {
        orderBy: { id: "asc" },
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
    projectId,
    positions,
  }: {
    projectId: number;
    positions: {
      amount: number;
      unit: InvoicePositionUnit;
      price: number;
      description: string;
    }[];
  }
) => {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
      customer: {
        userId,
      },
    },
    include: {
      customer: {
        select: { number: true },
      },
    },
  });

  if (!project) {
    return null;
  }

  return await db.invoice.create({
    data: {
      projectId,
      positions: {
        createMany: {
          data: positions,
        },
      },
    },
    include: {
      positions: true,
    },
  });
};

const edit = async (
  userId: number,
  {
    id,
    projectId,
    deletedPositions,
    positions,
  }: {
    id: number;
    projectId?: number;
    deletedPositions?: {
      id: number;
    }[];
    positions?: {
      id: number;
      amount?: number;
      unit?: InvoicePositionUnit;
      description?: string;
      price?: number;
      added?: boolean;
    }[];
  }
) => {
  const invoice = await db.invoice.findUnique({
    where: {
      id,
      project: {
        customer: {
          userId,
        },
      },
    },
  });

  if (!invoice || invoice.locked) {
    return null;
  }

  const updatedPositions = positions?.filter((position) => !position.added);
  const addedPositions = positions?.filter((position) => position.added);

  if (updatedPositions) {
    const oldPositionsToEditCount = await db.invoicePosition.count({
      where: {
        id: {
          in: [
            ...updatedPositions
              .filter((position) => !position.added)
              .map((position) => position.id),
          ],
        },
      },
    });

    if (oldPositionsToEditCount !== updatedPositions.length) {
      return null;
    }
  }

  if (deletedPositions) {
    const oldPositionsToDeleteCount = await db.invoicePosition.count({
      where: {
        id: {
          in: [...deletedPositions.map((position) => position.id)],
        },
      },
    });

    if (oldPositionsToDeleteCount !== deletedPositions.length) {
      return null;
    }
  }

  if (addedPositions) {
    for (const addedPosition of addedPositions) {
      if (
        !addedPosition.amount ||
        !addedPosition.unit ||
        !addedPosition.description ||
        !addedPosition.price
      ) {
        return null;
      }
    }
  }

  return await db.invoice.update({
    where: {
      id,
    },
    data: {
      projectId,
      positions: {
        deleteMany: deletedPositions,
        createMany: addedPositions && {
          data: addedPositions.map((position) => ({
            amount: position.amount!,
            unit: position.unit!,
            description: position.description!,
            price: position.price!,
          })),
        },
        updateMany: updatedPositions?.map((position) => ({
          where: { id: position.id },
          data: {
            amount: position.amount,
            unit: position.unit,
            description: position.description,
            price: position.price,
          },
        })),
      },
    },
    include: { positions: true },
  });
};

const deleteInvoice = async (userId: number, { id }: { id: number }) => {
  const invoice = await db.invoice.findUnique({
    where: {
      id,
      project: {
        customer: {
          userId,
        },
      },
    },
  });

  if (!invoice || invoice.locked) {
    return null;
  }

  return await db.invoice.delete({
    where: {
      id,
    },
  });
};

export default { getInvoices, add, edit, deleteInvoice };
