"use server";

import { NextResponse } from "next/server";

import user from "@/services/user";

import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler = async (req) => {
  const userId = req.user!;

  const loggedInUser = await user.get(userId);

  return NextResponse.json(loggedInUser);
};

const GET = withMiddleware([authenticate], handler);

export { GET };
