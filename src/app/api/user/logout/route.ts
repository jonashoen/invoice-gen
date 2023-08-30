"use server";

import { NextResponse } from "next/server";

import destroySession from "@/lib/destroySession";
import Pages from "@/routes/Pages";
import user from "@/services/user";
import isAuthed from "@/lib/isAuthed";

const POST = async () => {
  const session = await isAuthed();

  if (!session) {
    return NextResponse.redirect(Pages.Login);
  }

  await user.logout(session);

  return destroySession();
};

export { POST };
