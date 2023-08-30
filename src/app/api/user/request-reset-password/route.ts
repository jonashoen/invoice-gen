import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import user from "@/services/user";
import Pages from "@/routes/Pages";
import { RequestResetPasswordRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<RequestResetPasswordRequest>) => {
  const session = await isAuthed();
  if (session) {
    return NextResponse.redirect(Pages.Invoices);
  }

  const body = await parse(userSchemas.requestResetPassword, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  user.requestResetPassword(body);

  return new NextResponse();
};

export { POST };
