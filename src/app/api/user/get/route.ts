"use server";

import { NextResponse } from "next/server";

import user from "@/services/user";

import apiError from "@/lib/apiError";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { StatusCodes } from "http-status-codes";

const GET = async (request: BaseRequest) => {
  const session = await request.session();

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const loggedInUser = await user.get(session);

  return NextResponse.json(loggedInUser);
};

export { GET };
