"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { EditProjectRequest } from "@/interfaces/requests/project";
import projectSchemas from "@/schemas/project";
import { StatusCodes } from "http-status-codes";

const POST = async (request: BaseRequest<EditProjectRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const body = await request.parse(projectSchemas.editProject);
  if (!body) {
    return apiError(StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const editedProject = await project.edit(session, body);

  if (!editedProject) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(editedProject);
};

export { POST };
