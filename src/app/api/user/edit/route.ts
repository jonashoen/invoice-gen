"use server";

import { NextResponse } from "next/server";

import user from "@/services/user";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import apiError from "@/lib/apiError";
import { EditUserRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";

const POST = async (request: BaseRequest<EditUserRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(userSchemas.editUser);
  if (!body) {
    return apiError(422);
  }

  const editedUser = await user.edit(session, body);

  if (!editedUser) {
    return apiError(400);
  }

  return new NextResponse();
};

export { POST };
