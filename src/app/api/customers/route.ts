"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";

const GET = async (request: BaseRequest) => {
  const session = await request.session();

  if (!session) {
    return apiError(401);
  }

  const customers = await customer.getCustomers(session);

  return NextResponse.json(customers);
};

export { GET };
