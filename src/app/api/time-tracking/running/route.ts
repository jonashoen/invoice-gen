"use server";

import { NextResponse } from "next/server";

import timeTracking from "@/services/timeTracking";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler = async (req) => {
  const userId = req.user!;

  const runningTimeTrack = await timeTracking.getRunning(userId);

  return NextResponse.json(runningTimeTrack);
};

const GET = withMiddleware([authenticate], handler);

export { GET };
