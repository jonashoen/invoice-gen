"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";

const GET = async () => {
  const session = await isAuthed();

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const customers = await customer.getCustomers(session);

  return NextResponse.json(customers);
};

export { GET };
