"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";

const GET = async () => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const invoices = await invoice.getInvoices(session);

  return NextResponse.json(invoices);
};

export { GET };
