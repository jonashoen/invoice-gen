"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import invoice from "@/services/invoice";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";

const GET = async (
  _: Request,
  { params }: { params: { filename: string } }
) => {
  const session = await isAuthed();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const invoiceStream = await invoice.get(session, params.filename);

  if (!invoiceStream) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse(invoiceStream, {
    headers: { "Content-Type": "application/pdf" },
  });
};

export { GET };
