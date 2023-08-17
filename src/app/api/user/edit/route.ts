"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import user from "@/services/user";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import apiError from "@/lib/apiError";
import { EditUserRequest } from "@/interfaces/requests/user";

const POST = async (request: BaseRequest<EditUserRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const editedUser = await user.edit(session, body);

  if (!editedUser) {
    return apiError(400);
  }

  return new NextResponse();
};

export { POST };
