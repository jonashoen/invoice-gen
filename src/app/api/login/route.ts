"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import LoginRequest from "@/interfaces/requests/login";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import createSession from "@/lib/createSession";
import { StatusCodes } from "http-status-codes";

const POST = async (request: BaseRequest<LoginRequest>) => {
  if (isAuthed()) {
    return NextResponse.redirect("/");
  }

  const body = await request.json();

  const session = await user.login(body);

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  return createSession(session.sessionId);
};

export { POST };
