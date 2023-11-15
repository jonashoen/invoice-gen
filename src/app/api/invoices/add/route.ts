import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import { AddInvoiceRequest } from "@/interfaces/requests/";
import invoiceSchemas from "@/schemas/invoice";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<AddInvoiceRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const addedInvoice = await invoice.add(userId, payload);
  if (!addedInvoice) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(addedInvoice);
};

const POST = withMiddleware(
  [authenticate, validateBody(invoiceSchemas.addInvoice)],
  handler
);

export { POST };
