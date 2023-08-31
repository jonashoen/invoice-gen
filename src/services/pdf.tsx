import process from "process";
import path from "path";
import fs from "fs";

import {
  Customer,
  Invoice,
  InvoicePosition,
  PaymentDueUnit,
  Profile,
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
      customer: Customer & { user: User & { profile: Profile } };
    };
    positions: InvoicePosition[];
  },
  number: string
) => {
  const filename = generateFileName();
  const filePath = path.join(pdfDirPath, filename);

  const ReactDOMServer = (await import("react-dom/server")).default;

  try {
    await ReactPDF.renderToFile(
      <InvoicePdf
        invoice={invoice}
        number={number}
        renderToStaticMarkup={ReactDOMServer.renderToStaticMarkup}
      />,
      filePath
    );

    return filename;
  } catch (err) {
    console.error(err);

    return null;
  }
};

const getFile = (filename: string) => {
  try {
    return fs.createReadStream(path.join(pdfDirPath, filename));
  } catch (err) {
    console.error(err);

    return null;
  }
};

export default {
  createInvoice,
  getFile,
};

const generateFileName = () => crypto.randomUUID();
