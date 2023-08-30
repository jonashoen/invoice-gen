"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { PublishInvoiceRequest } from "@/interfaces/requests/invoice";
import invoiceSchemas from "@/schemas/invoice";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<PublishInvoiceRequest>) => {
  const session = await isAuthed();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await parse(invoiceSchemas.publishInvoice, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const publishedInvoice = await invoice.publish(session, body);

  if (!publishedInvoice) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(publishedInvoice);
};

export { POST };
