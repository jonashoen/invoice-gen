"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import { PublishInvoiceRequest } from "@/interfaces/requests/invoice";
import invoiceSchemas from "@/schemas/invoice";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<PublishInvoiceRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const publishedInvoice = await invoice.publish(userId, payload);

  if (!publishedInvoice) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(publishedInvoice);
};

const POST = withMiddleware(
  [authenticate, validateBody(invoiceSchemas.publishInvoice)],
  handler
);

export { POST };
