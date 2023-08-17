"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { EditCustomerRequest } from "@/interfaces/requests/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";

const POST = async (request: BaseRequest<EditCustomerRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const editedCustomer = await customer.editCustomer(session, body);

  if (!editedCustomer) {
    return apiError(400);
  }

  return NextResponse.json(editedCustomer);
};

export { POST };
