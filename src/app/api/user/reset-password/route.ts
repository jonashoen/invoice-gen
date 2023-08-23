import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import isAuthed from "@/lib/isAuthed";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import Pages from "@/routes/Pages";
import { ResetPasswordRequest } from "@/interfaces/requests/user";

const POST = async (request: BaseRequest<ResetPasswordRequest>) => {
  const oldSession = await isAuthed();

  if (oldSession) {
    return NextResponse.redirect(Pages.Invoices);
  }

  const body = await request.json();

  const result = await user.resetPassword(body);

  if (!result) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
