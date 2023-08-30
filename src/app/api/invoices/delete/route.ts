"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { DeleteInvoiceRequest } from "@/interfaces/requests/invoice";
import invoiceSchemas from "@/schemas/invoice";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<DeleteInvoiceRequest>) => {
  const session = await isAuthed();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await parse(invoiceSchemas.deleteInvoice, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const deletedInvoice = await invoice.deleteInvoice(session, body);
  if (!deletedInvoice) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(deletedInvoice);
};

export { POST };
