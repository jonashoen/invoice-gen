import process from "process";
import path from "path";
import fs from "fs";

import {
  Customer,
  Invoice,
  InvoicePosition,
  PaymentDueUnit,
  User,
} from "@prisma/client";
import ReactPDF from "@joshuajaco/react-pdf-renderer-bundled";
import InvoicePdf from "@/pdf/pdf";

const pdfDirPath = path.join(process.cwd(), "pdfs");

const createInvoice = async (
  invoice: Invoice & {
    project: {
      paymentDue: number;
      paymentDueUnit: PaymentDueUnit;
      customer: Customer & { user: User };
    };
    positions: InvoicePosition[];
  },
  number: string
) => {
  const filename = generateFileName();
  const filePath = path.join(pdfDirPath, filename);

  const ReactDOMServer = (await import("react-dom/server")).default;

  await ReactPDF.renderToFile(
    <InvoicePdf
      invoice={invoice}
      number={number}
      renderToStaticMarkup={ReactDOMServer.renderToStaticMarkup}
    />,
    filePath
  );

  return filename;
};

const getFile = (filename: string) => {
  return fs.createReadStream(path.join(pdfDirPath, filename));
};

export default {
  createInvoice,
  getFile,
};

const generateFileName = () => crypto.randomUUID();
