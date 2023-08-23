import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import RegisterRequest from "@/interfaces/requests/register";
import isAuthed from "@/lib/isAuthed";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import Pages from "@/routes/Pages";

const POST = async (request: BaseRequest<RegisterRequest>) => {
  const oldSession = await isAuthed();

  if (oldSession) {
    return NextResponse.redirect(Pages.Invoices);
  }

  const body = await request.json();

  const registeredUser = await user.register(body);

  if (!registeredUser) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
