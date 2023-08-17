"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { DeleteProjectRequest } from "@/interfaces/requests/project";

const POST = async (request: BaseRequest<DeleteProjectRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const deletedProject = await project.deleteProject(session, body);

  if (!deletedProject) {
    return apiError(400);
  }

  return new NextResponse();
};

export { POST };
