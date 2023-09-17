"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { DeleteProjectRequest } from "@/interfaces/requests/project";
import projectSchemas from "@/schemas/project";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";
import parse from "@/lib/validate";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const hander: RequestHandler<DeleteProjectRequest> = async (req) => {
  const userId = req.user!;
  const payload = req.data!;

  const deletedProject = await project.deleteProject(userId, payload);

  if (!deletedProject) {
    return apiError(StatusCodes.BAD_REQUEST);
  }

  return new NextResponse();
};

const POST = withMiddleware(
  [authenticate, validateBody(projectSchemas.deleteProject)],
  hander
);

export { POST };
