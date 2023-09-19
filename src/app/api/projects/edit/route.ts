"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import { EditProjectRequest } from "@/interfaces/requests/project";
import projectSchemas from "@/schemas/project";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<EditProjectRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const editedProject = await project.edit(userId, payload);

  if (!editedProject) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(editedProject);
};

const POST = withMiddleware(
  [authenticate, validateBody(projectSchemas.editProject)],
  handler
);

export { POST };
