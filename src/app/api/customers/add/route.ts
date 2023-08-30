"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { AddCustomerRequest } from "@/interfaces/requests/customer";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import customerRequests from "@/schemas/customer";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<AddCustomerRequest>) => {
  const session = await isAuthed();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await parse(customerRequests.addCustomer, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const createdCustomer = await customer.addCustomer(session, body);
  if (!createdCustomer) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(createdCustomer);
};

export { POST };
