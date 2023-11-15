import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import timeTracking from "@/services/timeTracking";
import { StatusCodes } from "http-status-codes";
import { StopTimeTrackRequest } from "@/interfaces/requests";
import timeTrakingSchemas from "@/schemas/timeTrack";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<StopTimeTrackRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const stopedTimeTrack = await timeTracking.stop(userId, payload);

  if (!stopedTimeTrack) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(stopedTimeTrack);
};

const POST = withMiddleware(
  [authenticate, validateBody(timeTrakingSchemas.stopTimeTrackRequest)],
  handler
);

export { POST };
