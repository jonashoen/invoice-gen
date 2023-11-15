import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import timeTracking from "@/services/timeTracking";
import { StatusCodes } from "http-status-codes";
import { StartTimeTrackRequest } from "@/interfaces/requests";
import timeTrakingSchemas from "@/schemas/timeTrack";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<StartTimeTrackRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const startedTimeTrack = await timeTracking.start(userId, payload);

  if (!startedTimeTrack) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(startedTimeTrack);
};

const POST = withMiddleware(
  [authenticate, validateBody(timeTrakingSchemas.startTimeTrackRequest)],
  handler
);

export { POST };
