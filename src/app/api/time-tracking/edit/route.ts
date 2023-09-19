"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import timeTracking from "@/services/timeTracking";
import { StatusCodes } from "http-status-codes";
import { EditTimeTrackRequest } from "@/interfaces/requests";
import timeTrakingSchemas from "@/schemas/timeTrack";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<EditTimeTrackRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const editedTimeTrack = await timeTracking.edit(userId, payload);

  if (!editedTimeTrack) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(editedTimeTrack);
};

const POST = withMiddleware(
  [authenticate, validateBody(timeTrakingSchemas.editTimeTrackRequest)],
  handler
);

export { POST };
