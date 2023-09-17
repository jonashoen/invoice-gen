"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import { DeleteInvoiceRequest } from "@/interfaces/requests/invoice";
import invoiceSchemas from "@/schemas/invoice";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler<DeleteInvoiceRequest> = async (req) => {
  const userId = req.user!;
  const payload = req.data!;

  const deletedInvoice = await invoice.deleteInvoice(userId, payload);
  if (!deletedInvoice) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(deletedInvoice);
};

const POST = withMiddleware(
  [authenticate, validateBody(invoiceSchemas.deleteInvoice)],
  handler
);

export { POST };
