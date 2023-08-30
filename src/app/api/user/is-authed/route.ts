"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { StatusCodes } from "http-status-codes";

const GET = async (request: BaseRequest) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  return new NextResponse();
};

export { GET };
