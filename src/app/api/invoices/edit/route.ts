"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { EditInvoiceRequest } from "@/interfaces/requests/invoice";

const POST = async (request: BaseRequest<EditInvoiceRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const editedInvoice = await invoice.edit(session, body);

  if (!editedInvoice) {
    return apiError(400);
  }

  return NextResponse.json(editedInvoice);
};

export { POST };
