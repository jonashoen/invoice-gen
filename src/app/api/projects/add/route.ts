"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { AddProjectRequest } from "@/interfaces/requests/project";
import projectSchemas from "@/schemas/project";

const POST = async (request: BaseRequest<AddProjectRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(projectSchemas.addProject);
  if (!body) {
    return apiError(422);
  }

  const addedProject = await project.add(session, body);

  if (!addedProject) {
    return apiError(400);
  }

  return NextResponse.json(addedProject);
};

export { POST };
