"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { AddInvoiceRequest } from "@/interfaces/requests/";
import invoiceSchemas from "@/schemas/invoice";
import { StatusCodes } from "http-status-codes";

const POST = async (request: BaseRequest<AddInvoiceRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await request.parse(invoiceSchemas.addInvoice);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const addedInvoice = await invoice.add(session, body);
  if (!addedInvoice) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(addedInvoice);
};

export { POST };
