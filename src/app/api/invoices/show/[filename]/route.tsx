"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";

const GET = async (
  _: Request,
  { params }: { params: { filename: string } }
) => {
  const session = await isAuthed();

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
