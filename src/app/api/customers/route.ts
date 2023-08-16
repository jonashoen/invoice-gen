"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import customer from "@/services/customer";

const GET = async () => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const customers = await customer.getCustomers(session);

  return NextResponse.json(customers);
};

export { GET };
