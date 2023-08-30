"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { DeleteProjectRequest } from "@/interfaces/requests/project";
import projectSchemas from "@/schemas/project";

const POST = async (request: BaseRequest<DeleteProjectRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(projectSchemas.deleteProject);
  if (!body) {
    return apiError(422);
  }

  const deletedProject = await project.deleteProject(session, body);

  if (!deletedProject) {
    return apiError(400);
  }

  return new NextResponse();
};

export { POST };
