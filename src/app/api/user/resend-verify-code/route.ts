import { NextResponse } from "next/server";

import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import { ResendVerifyCodeRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import withMiddleware from "@/middlewares/withMiddleware";
import unauthenticate from "@/middlewares/unauthenticate";
import validateBody from "@/middlewares/validateBody";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler<ResendVerifyCodeRequest> = async (req) => {
  const payload = req.data!;

  const result = await user.resendVerifyCode(payload);

  if (!result) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

const POST = withMiddleware(
  [unauthenticate, validateBody(userSchemas.resendVerifyCode)],
  handler
);

export { POST };
