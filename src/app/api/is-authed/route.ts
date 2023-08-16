"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";

const GET = async () => {
  if (!isAuthed()) {
    return apiError(401);
  }

  return new NextResponse();
};

export { GET };
