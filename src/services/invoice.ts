import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import db from "@/db";
import {
  Customer,
  Invoice,
  InvoicePosition,
  InvoicePositionUnit,
  PaymentDueUnit,
  Profile,
  User,
} from "@prisma/client";
import pdf from "@/services/pdf";
import { ReadStream } from "fs";

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
      id: "desc",
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

  if (!project || project.archived) {
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
    addedPositions,
    updatedPositions,
    deletedPositions,
  }: {
    id: number;
    projectId?: number;
    addedPositions?: {
      amount: number;
      unit: InvoicePositionUnit;
      description: string;
      price: number;
    }[];
    updatedPositions?: {
      id: number;
      amount?: number;
      unit?: InvoicePositionUnit;
      description?: string;
      price?: number;
    }[];
    deletedPositions?: number[];
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

  if (projectId) {
    const project = await db.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project || project.archived) {
      return null;
    }
  }

  if (updatedPositions && updatedPositions.length !== 0) {
    const oldPositionsToEditCount = await db.invoicePosition.count({
      where: {
        id: {
          in: updatedPositions.map((position) => position.id),
        },
      },
    });

    if (oldPositionsToEditCount !== updatedPositions.length) {
      return null;
    }
  }

  if (deletedPositions && deletedPositions.length !== 0) {
    const oldPositionsToDeleteCount = await db.invoicePosition.count({
      where: {
        id: {
          in: deletedPositions,
        },
      },
    });

    if (oldPositionsToDeleteCount !== deletedPositions.length) {
      return null;
    }
  }

  return await db.invoice.update({
    where: {
      id,
    },
    data: {
      projectId,
      positions: {
        deleteMany: deletedPositions?.map((position) => ({ id: position })),
        createMany: addedPositions && {
          data: addedPositions,
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

const publish = async (userId: number, { id }: { id: number }) => {
  const invoice = (await db.invoice.findUnique({
    where: {
      id,
      project: {
        customer: {
          userId,
        },
      },
    },
    include: {
      project: {
        select: {
          paymentDue: true,
          paymentDueUnit: true,
          customer: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      },
      positions: {
        orderBy: {
          id: "asc",
        },
      },
    },
  })) as Invoice & {
    project: {
      paymentDue: number;
      paymentDueUnit: PaymentDueUnit;
      customer: Customer & { user: User & { profile: Profile } };
    };
    positions: InvoicePosition[];
  };

  if (!invoice || invoice.locked) {
    return null;
  }

  const date = dayjs.utc();

  const invoiceCountForCustomerThisYear = await db.invoice.count({
    where: {
      date: {
        gte: date.startOf("year").toDate(),
        lte: date.endOf("year").toDate(),
      },
      project: {
        customer: {
          id: invoice.project.customer.id,
        },
      },
      locked: true,
    },
  });

  const invoiceCountFormatted = (invoiceCountForCustomerThisYear + 1)
    .toString()
    .padStart(3, "0");

  const number = `${date.get("year")}/${
    invoice.project.customer.number
  }/${invoiceCountFormatted}`;

  const filename = await pdf.createInvoice(invoice, number);

  if (!filename) {
    return null;
  }

  return await db.invoice.update({
    where: {
      id,
    },
    data: {
      locked: true,
      number,
      filename,
      date: date.toDate(),
    },
  });
};

const get = async (userId: number, filename: string) => {
  const invoice = await db.invoice.findFirst({
    where: {
      filename,
      project: {
        customer: {
          userId,
        },
      },
    },
  });

  if (!invoice) {
    return null;
  }

  const fileStream = pdf.getFile(filename);

  if (!fileStream) {
    return null;
  }

  return iteratorToStream(nodeStreamToIterator(fileStream));
};

export default { getInvoices, add, edit, deleteInvoice, publish, get };

/* istanbul ignore next */
async function* nodeStreamToIterator(stream: ReadStream) {
  for await (const chunk of stream) {
    yield chunk;
  }
}

/* istanbul ignore next */
function iteratorToStream(iterator: AsyncGenerator<any>): ReadableStream {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(new Uint8Array(value));
      }
    },
  });
}
