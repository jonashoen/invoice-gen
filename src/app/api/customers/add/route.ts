"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { AddCustomerRequest } from "@/interfaces/requests/customer";
import customerRequests from "@/schemas/customer";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<AddCustomerRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const createdCustomer = await customer.addCustomer(userId, payload);
  if (!createdCustomer) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(createdCustomer);
};

const POST = withMiddleware(
  [authenticate, validateBody(customerRequests.addCustomer)],
  handler
);

export { POST };
