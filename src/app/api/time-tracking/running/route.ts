import { NextResponse } from "next/server";

import timeTracking from "@/services/timeTracking";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler = async (req) => {
  const userId = req.user;

  const runningTimeTrack = await timeTracking.getRunning(userId);

  return NextResponse.json(runningTimeTrack);
};

const GET = withMiddleware([authenticate], handler);

export { GET };
