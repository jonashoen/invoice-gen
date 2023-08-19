"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { AddInvoiceRequest } from "@/interfaces/requests/invoice";

const POST = async (request: BaseRequest<AddInvoiceRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const addedInvoice = await invoice.add(session, body);

  if (!addedInvoice) {
    return apiError(400);
  }

  return NextResponse.json(addedInvoice);
};

export { POST };
