"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import user from "@/services/user";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import apiError from "@/lib/apiError";
import { ChangePasswordRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";

const POST = async (request: BaseRequest<ChangePasswordRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(userSchemas.changePassword);
  if (!body) {
    return apiError(422);
  }

  const editedUser = await user.changePassword(session, body);

  if (!editedUser) {
    return apiError(400);
  }

  return new NextResponse();
};

export { POST };
