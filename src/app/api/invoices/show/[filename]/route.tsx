"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import { ShowInvoiceRequest } from "@/interfaces/requests";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler<unknown, ShowInvoiceRequest> = async (
  req,
  { params }
) => {
  const userId = req.user!;

  const invoiceStream = await invoice.get(userId, params.filename);

  if (!invoiceStream) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse(invoiceStream, {
    headers: { "Content-Type": "application/pdf" },
  });
};

const GET = withMiddleware([authenticate], handler);

export { GET };
