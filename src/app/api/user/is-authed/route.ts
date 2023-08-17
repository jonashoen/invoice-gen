"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";

const GET = async () => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  return new NextResponse();
};

export { GET };
