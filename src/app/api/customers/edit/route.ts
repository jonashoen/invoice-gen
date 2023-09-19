"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { EditCustomerRequest } from "@/interfaces/requests/customer";
import customerSchemas from "@/schemas/customer";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<EditCustomerRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const editedCustomer = await customer.editCustomer(userId, payload);
  if (!editedCustomer) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(editedCustomer);
};

const POST = withMiddleware(
  [authenticate, validateBody(customerSchemas.editCustomer)],
  handler
);

export { POST };
