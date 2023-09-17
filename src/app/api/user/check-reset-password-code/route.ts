import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import { CheckResetPasswordCodeRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import Pages from "@/routes/Pages";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/validate";
import withMiddleware from "@/middlewares/withMiddleware";
import unauthenticate from "@/middlewares/unauthenticate";
import validateBody from "@/middlewares/validateBody";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler<CheckResetPasswordCodeRequest> = async (req) => {
  const payload = req.data!;

  const result = await user.checkResetPasswordCode(payload);

  if (!result) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};
const POST = withMiddleware(
  [unauthenticate, validateBody(userSchemas.checkResetPasswordCode)],
  handler
);

export { POST };
