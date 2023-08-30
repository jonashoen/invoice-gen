import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import { RegisterRequest } from "@/interfaces/requests/user";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import Pages from "@/routes/Pages";
import userSchemas from "@/schemas/user";
import isAuthed from "@/lib/isAuthed";

const POST = async (request: BaseRequest<RegisterRequest>) => {
  const session = await isAuthed();
  if (session) {
    return NextResponse.redirect(Pages.Invoices);
  }

  const body = await request.parse(userSchemas.register);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const registeredUser = await user.register(body);

  if (!registeredUser) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
