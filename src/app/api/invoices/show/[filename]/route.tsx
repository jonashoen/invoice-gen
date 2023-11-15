import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import { ShowInvoiceRequest } from "@/interfaces/requests";
import invoiceSchemas from "@/schemas/invoice";
import validateParams from "@/middlewares/validateParams";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<unknown, ShowInvoiceRequest> = async (
  req
) => {
  const userId = req.user;
  const filename = req.params.filename;

  const invoiceStream = await invoice.get(userId, filename);

  if (!invoiceStream) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse(invoiceStream, {
    headers: { "Content-Type": "application/pdf" },
  });
};

const GET = withMiddleware(
  [authenticate, validateParams(invoiceSchemas.showInvoice)],
  handler
);

export { GET };
