import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import timeTracking from "@/services/timeTracking";
import { StatusCodes } from "http-status-codes";
import { ExportTimeTrackRequest } from "@/interfaces/requests";
import timeTrakingSchemas from "@/schemas/timeTrack";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<ExportTimeTrackRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const exportData = await timeTracking.exportTimeTracking(userId, payload);

  if (!exportData) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(exportData);
};

const POST = withMiddleware(
  [authenticate, validateBody(timeTrakingSchemas.exportTimeTracks)],
  handler
);

export { POST };
