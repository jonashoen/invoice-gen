"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import timeTracking from "@/services/timeTracking";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { DeleteTimeTrackRequest } from "@/interfaces/requests";
import parse from "@/lib/parse";
import timeTrakingSchemas from "@/schemas/timeTrack";

const POST = async (request: BaseRequest<DeleteTimeTrackRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await parse(timeTrakingSchemas.deleteTimeTrackRequest, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const deleteTimeTrack = await timeTracking.deleteEntry(session, body);

  if (!deleteTimeTrack) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
