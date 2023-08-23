import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import RegisterRequest from "@/interfaces/requests/register";
import isAuthed from "@/lib/isAuthed";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import Pages from "@/routes/Pages";
import { VerifyAccountRequest } from "@/interfaces/requests/user";
import createSession from "@/lib/createSession";

const POST = async (request: BaseRequest<VerifyAccountRequest>) => {
  const oldSession = await isAuthed();

  if (oldSession) {
    return NextResponse.redirect(Pages.Dashboard);
  }

  const body = await request.json();

  const session = await user.verify(body);

  if (!session) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return createSession(session.sessionId);
};

export { POST };
