import { NextResponse } from "next/server";

import invoice from "@/services/invoice";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler = async (req) => {
  const userId = req.user;

  const invoices = await invoice.getInvoices(userId);

  return NextResponse.json(invoices);
};

const GET = withMiddleware([authenticate], handler);

export { GET };
