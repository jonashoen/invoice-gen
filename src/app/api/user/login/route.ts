"use server";

import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import { LoginRequest } from "@/interfaces/requests/user";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import createSession from "@/lib/createSession";
import { StatusCodes } from "http-status-codes";
import Pages from "@/routes/Pages";
import userSchemas from "@/schemas/user";

const POST = async (request: BaseRequest<LoginRequest>) => {
  const oldSession = await request.session();
  if (oldSession) {
    return NextResponse.redirect(Pages.Invoices);
  }

  const body = await request.parse(userSchemas.login);
  if (!body) {
    return apiError(422);
  }

  const session = await user.login(body);

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  if (!session.sessionId) {
    return apiError(StatusCodes.FORBIDDEN);
  }

  return createSession(session.sessionId);
};

export { POST };
