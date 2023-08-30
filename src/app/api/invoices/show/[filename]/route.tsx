"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import BaseRequest from "@/interfaces/requests/BaseRequest";

const GET = async (
  request: BaseRequest,
  { params }: { params: { filename: string } }
) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const invoiceStream = await invoice.get(session, params.filename);

  if (!invoiceStream) {
    return apiError(400);
  }

  return new NextResponse(invoiceStream, {
    headers: { "Content-Type": "application/pdf" },
  });
};

export { GET };
