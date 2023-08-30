"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";

const GET = async () => {
  const session = await isAuthed();

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  return new NextResponse();
};

export { GET };
