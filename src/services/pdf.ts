import { Customer, Invoice, InvoicePosition, Project } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import db from "@/db";

dayjs.extend(utc);

const createInvoice = async (
  invoice: Invoice & {
    project: Project & { customer: Customer };
    positions: InvoicePosition[];
  }
) => {
  const invoiceCountForCustomerThisYear = await db.invoice.count({
    where: {
      date: {
        gte: dayjs.utc().startOf("year").toDate(),
        lte: dayjs.utc().endOf("year").toDate(),
      },
      project: {
        customer: {
          id: invoice.project.customerId,
        },
      },
      locked: true,
    },
  });

  const invoiceCountFormatted = (invoiceCountForCustomerThisYear + 1)
    .toString()
    .padStart(3, "0");

  const invoiceNumber = `${dayjs.utc().get("year")}/${
    invoice.project.customer.number
  }/${invoiceCountFormatted}`;
};

export default {
  createInvoice,
};

const generateFileName = () => crypto.randomUUID() + ".pdf";
