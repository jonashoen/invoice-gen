"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import timeTracking from "@/services/timeTracking";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { EditTimeTrackRequest } from "@/interfaces/requests";
import parse from "@/lib/parse";
import timeTrakingSchemas from "@/schemas/timeTrack";

const POST = async (request: BaseRequest<EditTimeTrackRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await parse(timeTrakingSchemas.editTimeTrackRequest, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const editedTimeTrack = await timeTracking.edit(session, body);

  if (!editedTimeTrack) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(editedTimeTrack);
};

export { POST };
