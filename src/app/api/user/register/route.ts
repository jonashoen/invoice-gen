import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import { RegisterRequest } from "@/interfaces/requests/user";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import Pages from "@/routes/Pages";
import userSchemas from "@/schemas/user";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/validate";
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
