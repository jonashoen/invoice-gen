"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { AddProjectRequest } from "@/interfaces/requests/project";
import projectSchemas from "@/schemas/project";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/parse";

const POST = async (request: BaseRequest<AddProjectRequest>) => {
  const session = await isAuthed();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await parse(projectSchemas.addProject, request);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const addedProject = await project.add(session, body);

  if (!addedProject) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(addedProject);
};

export { POST };
