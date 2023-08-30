"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { EditCustomerRequest } from "@/interfaces/requests/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import customerSchemas from "@/schemas/customer";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<EditCustomerRequest>) => {
  const session = await isAuthed();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await parse(customerSchemas.editCustomer, request);
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
