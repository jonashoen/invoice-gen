"use server";

import { NextResponse } from "next/server";

import user from "@/services/user";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";

const GET = async () => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const loggedInUser = await user.get(session);

  return NextResponse.json(loggedInUser);
};

export { GET };
