"use server";

import { NextResponse } from "next/server";

import user from "@/services/user";
import apiError from "@/lib/apiError";
import { ChangePasswordRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<ChangePasswordRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const editedUser = await user.changePassword(userId, payload);

  if (!editedUser) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

const POST = withMiddleware(
  [authenticate, validateBody(userSchemas.changePassword)],
  handler
);

export { POST };
