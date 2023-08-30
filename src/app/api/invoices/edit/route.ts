"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { EditInvoiceRequest } from "@/interfaces/requests/invoice";
import invoiceSchemas from "@/schemas/invoice";

const POST = async (request: BaseRequest<EditInvoiceRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(invoiceSchemas.editInvoice);
  if (!body) {
    return apiError(422);
  }

  const editedInvoice = await invoice.edit(session, body);
  if (!editedInvoice) {
    return apiError(400);
  }

  return NextResponse.json(editedInvoice);
};

export { POST };
