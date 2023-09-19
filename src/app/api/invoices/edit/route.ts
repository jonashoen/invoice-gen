"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import { EditInvoiceRequest } from "@/interfaces/requests/invoice";
import invoiceSchemas from "@/schemas/invoice";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<EditInvoiceRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const editedInvoice = await invoice.edit(userId, payload);
  if (!editedInvoice) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(editedInvoice);
};

const POST = withMiddleware(
  [authenticate, validateBody(invoiceSchemas.editInvoice)],
  handler
);

export { POST };
