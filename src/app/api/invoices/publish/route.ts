"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { PublishInvoiceRequest } from "@/interfaces/requests/invoice";

const POST = async (request: BaseRequest<PublishInvoiceRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const publishedInvoice = await invoice.publish(session, body);

  if (!publishedInvoice) {
    return apiError(400);
  }

  return NextResponse.json(publishedInvoice);
};

export { POST };
