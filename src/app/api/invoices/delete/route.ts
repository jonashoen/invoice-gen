"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { DeleteInvoiceRequest } from "@/interfaces/requests/invoice";
import invoiceSchemas from "@/schemas/invoice";

const POST = async (request: BaseRequest<DeleteInvoiceRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(invoiceSchemas.deleteInvoice);
  if (!body) {
    return apiError(422);
  }

  const deletedInvoice = await invoice.deleteInvoice(session, body);
  if (!deletedInvoice) {
    return apiError(400);
  }

  return NextResponse.json(deletedInvoice);
};

export { POST };
