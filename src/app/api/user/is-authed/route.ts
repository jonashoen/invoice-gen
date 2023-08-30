"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import BaseRequest from "@/interfaces/requests/BaseRequest";

const GET = async (request: BaseRequest) => {
  const session = await request.session();

  if (!session) {
    return apiError(401);
  }

  return new NextResponse();
};

export { GET };
