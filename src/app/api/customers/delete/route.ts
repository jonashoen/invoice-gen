"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import {
  AddCustomerRequest,
  DeleteCustomerRequest,
} from "@/interfaces/requests/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";

const POST = async (request: BaseRequest<DeleteCustomerRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const deletedCustomer = await customer.deleteCustomer(session, body);

  if (!deletedCustomer) {
    return apiError(400);
  }

  return NextResponse.json(deletedCustomer);
};

export { POST };
