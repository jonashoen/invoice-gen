"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { AddCustomerRequest } from "@/interfaces/requests/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";

const POST = async (request: BaseRequest<AddCustomerRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const createdCustomer = await customer.addCustomer(session, body);

  if (!createdCustomer) {
    return apiError(400);
  }

  return NextResponse.json(createdCustomer);
};

export { POST };
