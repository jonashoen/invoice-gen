"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { AddCustomerRequest } from "@/interfaces/requests/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import customerRequests from "@/schemas/customer";

const POST = async (request: BaseRequest<AddCustomerRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(customerRequests.addCustomerRequest);
  if (!body) {
    return apiError(422);
  }

  const createdCustomer = await customer.addCustomer(session, body);
  if (!createdCustomer) {
    return apiError(400);
  }

  return NextResponse.json(createdCustomer);
};

export { POST };
