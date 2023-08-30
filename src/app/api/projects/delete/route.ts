"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { DeleteProjectRequest } from "@/interfaces/requests/project";
import projectSchemas from "@/schemas/project";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";

const POST = async (request: BaseRequest<DeleteProjectRequest>) => {
  const session = await isAuthed();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await request.parse(projectSchemas.deleteProject);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const deletedProject = await project.deleteProject(session, body);

  if (!deletedProject) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

export { POST };
