"use server";

import { NextResponse } from "next/server";

import destroySession from "@/lib/destroySession";
import Pages from "@/routes/Pages";
import user from "@/services/user";
import BaseRequest from "@/interfaces/requests/BaseRequest";

const POST = async (request: BaseRequest) => {
  const session = await request.session();

  if (!session) {
    return NextResponse.redirect(Pages.Login);
  }

  await user.logout(session);

  return destroySession();
};

export { POST };
