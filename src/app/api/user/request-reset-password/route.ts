import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import isAuthed from "@/lib/isAuthed";
import user from "@/services/user";
import Pages from "@/routes/Pages";
import { RequestResetPasswordRequest } from "@/interfaces/requests/user";

const POST = async (request: BaseRequest<RequestResetPasswordRequest>) => {
  const oldSession = await isAuthed();

  if (oldSession) {
    return NextResponse.redirect(Pages.Dashboard);
  }

  const body = await request.json();

  user.requestResetPassword(body);

  return new NextResponse();
};

export { POST };
