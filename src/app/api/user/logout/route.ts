"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import destroySession from "@/lib/destroySession";
import Pages from "@/routes/Pages";

const POST = async () => {
  const session = await isAuthed();

  if (!session) {
    return NextResponse.redirect(Pages.Login);
  }

  return destroySession();
};

export { POST };
