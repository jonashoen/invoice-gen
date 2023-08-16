import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import RegisterRequest from "@/interfaces/requests/register";
import isAuthed from "@/lib/isAuthed";
import user from "@/services/user";
import createSession from "@/lib/createSession";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";

const POST = async (request: BaseRequest<RegisterRequest>) => {
  if (isAuthed()) {
    return NextResponse.redirect("/");
  }

  const body = await request.json();

  const session = await user.register(body);

  if (!session) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return createSession(session.sessionId);
};

export { POST };
