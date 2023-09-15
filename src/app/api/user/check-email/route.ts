import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import { CheckEmailRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<CheckEmailRequest>) => {
  const body = await parse(userSchemas.checkEmail, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const { email } = body;

  const userExists = await user.checkEmail(email);

  if (userExists) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
