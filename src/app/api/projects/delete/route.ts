import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import { DeleteProjectRequest } from "@/interfaces/requests/project";
import projectSchemas from "@/schemas/project";
import { StatusCodes } from "http-status-codes";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import validateBody from "@/middlewares/validateBody";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const hander: AuthedRequestHandler<DeleteProjectRequest> = async (req) => {
  const userId = req.user;
  const payload = req.data;

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
