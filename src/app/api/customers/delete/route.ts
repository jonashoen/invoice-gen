"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { DeleteCustomerRequest } from "@/interfaces/requests/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import customerSchemas from "@/schemas/customer";

const POST = async (request: BaseRequest<DeleteCustomerRequest>) => {
  const session = await request.session();

  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(customerSchemas.deleteCustomer);
  if (!body) {
    return apiError(422);
  }

  const deletedCustomer = await customer.deleteCustomer(session, body);
  if (!deletedCustomer) {
    return apiError(400);
  }

  return NextResponse.json(deletedCustomer);
};

export { POST };
