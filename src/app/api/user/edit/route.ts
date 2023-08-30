"use server";

import { NextResponse } from "next/server";

import user from "@/services/user";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import apiError from "@/lib/apiError";
import { EditUserRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<EditUserRequest>) => {
  const session = await isAuthed();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await parse(userSchemas.editUser, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const editedUser = await user.edit(session, body);

  if (!editedUser) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
