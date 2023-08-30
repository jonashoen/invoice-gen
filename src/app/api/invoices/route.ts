"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";

const GET = async () => {
  const session = await isAuthed();

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const invoices = await invoice.getInvoices(session);

  return NextResponse.json(invoices);
};

export { GET };
