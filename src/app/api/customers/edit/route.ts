"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { EditCustomerRequest } from "@/interfaces/requests/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import customerSchemas from "@/schemas/customer";
import { StatusCodes } from "http-status-codes";

const POST = async (request: BaseRequest<EditCustomerRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await request.parse(customerSchemas.editCustomer);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const editedCustomer = await customer.editCustomer(session, body);
  if (!editedCustomer) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(editedCustomer);
};

export { POST };
