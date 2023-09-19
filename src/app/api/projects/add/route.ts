"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import { AddProjectRequest } from "@/interfaces/requests/project";
import projectSchemas from "@/schemas/project";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler<AddProjectRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

  const addedProject = await project.add(userId, payload);

  if (!addedProject) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return NextResponse.json(addedProject);
};

const POST = withMiddleware(
  [authenticate, validateBody(projectSchemas.addProject)],
  handler
);

export { POST };
