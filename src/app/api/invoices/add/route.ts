"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { AddInvoiceRequest } from "@/interfaces/requests/";
import invoiceSchemas from "@/schemas/invoice";

const POST = async (request: BaseRequest<AddInvoiceRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(invoiceSchemas.addInvoice);
  if (!body) {
    return apiError(422);
  }

  const addedInvoice = await invoice.add(session, body);
  if (!addedInvoice) {
    return apiError(400);
  }

  return NextResponse.json(addedInvoice);
};

export { POST };
