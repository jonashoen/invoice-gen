"use server";

import { NextResponse } from "next/server";

import invoice from "@/services/invoice";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler = async (req) => {
  const userId = req.user!;

  const invoices = await invoice.getInvoices(userId);

  return NextResponse.json(invoices);
};

const GET = withMiddleware([authenticate], handler);

export { GET };
