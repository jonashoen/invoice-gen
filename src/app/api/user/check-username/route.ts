import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import { CheckUsernameRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<CheckUsernameRequest>) => {
  const body = await parse(userSchemas.checkUsername, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const { username } = body;

  const userExists = await user.checkUsername(username);

  if (userExists) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
