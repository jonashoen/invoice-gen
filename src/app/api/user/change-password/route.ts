"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import user from "@/services/user";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import apiError from "@/lib/apiError";
import { ChangePasswordRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import { StatusCodes } from "http-status-codes";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<ChangePasswordRequest>) => {
  const session = await isAuthed();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await parse(userSchemas.changePassword, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const editedUser = await user.changePassword(session, body);

  if (!editedUser) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
