import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import Pages from "@/routes/Pages";
import { VerifyAccountRequest } from "@/interfaces/requests/user";
import createSession from "@/lib/createSession";
import userSchemas from "@/schemas/user";

const POST = async (request: BaseRequest<VerifyAccountRequest>) => {
  const oldSession = await request.session();
  if (oldSession) {
    return NextResponse.redirect(Pages.Invoices);
  }

  const body = await request.parse(userSchemas.verifyAccount);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const session = await user.verify(body);

  if (!session) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return createSession(session.sessionId);
};

export { POST };
