import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import { CheckResetPasswordCodeRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import Pages from "@/routes/Pages";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<CheckResetPasswordCodeRequest>) => {
  const session = await isAuthed();
  if (session) {
    return NextResponse.redirect(Pages.Invoices);
  }

  const body = await parse(userSchemas.checkResetPasswordCode, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const result = await user.checkResetPasswordCode(body);

  if (!result) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
