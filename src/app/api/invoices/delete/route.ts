"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { DeleteInvoiceRequest } from "@/interfaces/requests/invoice";

const POST = async (request: BaseRequest<DeleteInvoiceRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const deletedInvoice = await invoice.deleteInvoice(session, body);

  if (!deletedInvoice) {
    return apiError(400);
  }

  return NextResponse.json(deletedInvoice);
};

export { POST };
