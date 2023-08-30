"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { EditCustomerRequest } from "@/interfaces/requests/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import customerSchemas from "@/schemas/customer";

const POST = async (request: BaseRequest<EditCustomerRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(customerSchemas.editCustomerRequest);
  if (!body) {
    return apiError(422);
  }

  const editedCustomer = await customer.editCustomer(session, body);
  if (!editedCustomer) {
    return apiError(400);
  }

  return NextResponse.json(editedCustomer);
};

export { POST };
