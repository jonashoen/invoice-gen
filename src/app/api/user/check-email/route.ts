import { NextResponse } from "next/server";

import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import { CheckEmailRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import withMiddleware from "@/middlewares/withMiddleware";
import validateBody from "@/middlewares/validateBody";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler<CheckEmailRequest> = async (req) => {
  const { email } = req.data!;

  const userExists = await user.checkEmail(email);

  if (userExists) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

const POST = withMiddleware([validateBody(userSchemas.checkEmail)], handler);

export { POST };
