"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { EditInvoiceRequest } from "@/interfaces/requests/invoice";
import invoiceSchemas from "@/schemas/invoice";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";

const POST = async (request: BaseRequest<EditInvoiceRequest>) => {
  const session = await isAuthed();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await request.parse(invoiceSchemas.editInvoice);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const editedInvoice = await invoice.edit(session, body);
  if (!editedInvoice) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(editedInvoice);
};

export { POST };
