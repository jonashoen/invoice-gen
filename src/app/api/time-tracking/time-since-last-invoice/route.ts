import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import timeTracking from "@/services/timeTracking";
import { StatusCodes } from "http-status-codes";
import { GetTimeTrackedSinceLastInvoice } from "@/interfaces/requests";
import timeTrakingSchemas from "@/schemas/timeTrack";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<GetTimeTrackedSinceLastInvoice> = async (
  req
) => {
  const userId = req.user;
  const payload = req.data;

  const timeSinceLastInvoice =
    await timeTracking.getTrackedTimeSinceLastInvoice(userId, payload);

  if (timeSinceLastInvoice === null) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(timeSinceLastInvoice);
};

const POST = withMiddleware(
  [
    authenticate,
    validateBody(timeTrakingSchemas.getTimeTrackedSinceLastInvoice),
  ],
  handler
);

export { POST };
