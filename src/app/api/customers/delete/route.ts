"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import customer from "@/services/customer";
import { DeleteCustomerRequest } from "@/interfaces/requests/customer";
import customerSchemas from "@/schemas/customer";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler<DeleteCustomerRequest> = async (req) => {
  const userId = req.user!;
  const payload = req.data!;

  const deletedCustomer = await customer.deleteCustomer(userId, payload);
  if (!deletedCustomer) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(deletedCustomer);
};

const POST = withMiddleware(
  [authenticate, validateBody(customerSchemas.deleteCustomer)],
  handler
);

export { POST };
