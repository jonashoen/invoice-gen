"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import destroySession from "@/lib/destroySession";

const POST = async () => {
  if (!isAuthed()) {
    return NextResponse.redirect("/login");
  }

  return destroySession();
};

export { POST };
