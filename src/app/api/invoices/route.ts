"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";

const GET = async (request: BaseRequest) => {
  const session = await request.session();

  if (!session) {
    return apiError(401);
  }

  const invoices = await invoice.getInvoices(session);

  return NextResponse.json(invoices);
};

export { GET };
