import { NextResponse } from "next/server";

import { RegisterRequest } from "@/interfaces/requests/user";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import userSchemas from "@/schemas/user";
import withMiddleware from "@/middlewares/withMiddleware";
import unauthenticate from "@/middlewares/unauthenticate";
import validateBody from "@/middlewares/validateBody";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler<RegisterRequest> = async (req) => {
  const payload = req.data!;

  const registeredUser = await user.register(payload);

  if (!registeredUser) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

const POST = withMiddleware(
  [unauthenticate, validateBody(userSchemas.register)],
  handler
);

export { POST };
