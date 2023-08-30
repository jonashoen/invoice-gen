"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { DeleteCustomerRequest } from "@/interfaces/requests/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import customerSchemas from "@/schemas/customer";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";

const POST = async (request: BaseRequest<DeleteCustomerRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await request.parse(customerSchemas.deleteCustomer);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const deletedCustomer = await customer.deleteCustomer(session, body);
  if (!deletedCustomer) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(deletedCustomer);
};

export { POST };
