"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import timeTracking from "@/services/timeTracking";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { StopTimeTrackRequest } from "@/interfaces/requests";
import parse from "@/lib/parse";
import timeTrakingSchemas from "@/schemas/timeTrack";

const POST = async (request: BaseRequest<StopTimeTrackRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await parse(timeTrakingSchemas.stopTimeTrackRequest, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const stopedTimeTrack = await timeTracking.stop(session, body);

  if (!stopedTimeTrack) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(stopedTimeTrack);
};

export { POST };
