import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import Pages from "@/routes/Pages";
import { ResendVerifyCodeRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";

const POST = async (request: BaseRequest<ResendVerifyCodeRequest>) => {
  const session = await request.session();
  if (session) {
    return NextResponse.redirect(Pages.Invoices);
  }

  const body = await request.parse(userSchemas.resendVerifyCode);
  if (!body) {
    return apiError(422);
  }

  const result = await user.resendVerifyCode(body);

  if (!result) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
