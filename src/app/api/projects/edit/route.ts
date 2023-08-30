"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { EditProjectRequest } from "@/interfaces/requests/project";
import projectSchemas from "@/schemas/project";

const POST = async (request: BaseRequest<EditProjectRequest>) => {
  const session = await request.session();
  if (!session) {
    return apiError(401);
  }

  const body = await request.parse(projectSchemas.editProject);
  if (!body) {
    return apiError(422);
  }

  const editedProject = await project.edit(session, body);

  if (!editedProject) {
    return apiError(400);
  }

  return NextResponse.json(editedProject);
};

export { POST };
