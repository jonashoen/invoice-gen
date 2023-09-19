"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import timeTracking from "@/services/timeTracking";
import { StatusCodes } from "http-status-codes";
import { DeleteTimeTrackRequest } from "@/interfaces/requests";
import timeTrakingSchemas from "@/schemas/timeTrack";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<DeleteTimeTrackRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const deleteTimeTrack = await timeTracking.deleteEntry(userId, payload);

  if (!deleteTimeTrack) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

const POST = withMiddleware(
  [authenticate, validateBody(timeTrakingSchemas.deleteTimeTrackRequest)],
  handler
);

export { POST };
