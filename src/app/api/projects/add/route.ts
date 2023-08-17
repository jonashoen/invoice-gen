"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { AddProjectRequest } from "@/interfaces/requests/project";

const POST = async (request: BaseRequest<AddProjectRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const addedProject = await project.add(session, body);

  if (!addedProject) {
    return apiError(400);
  }

  return NextResponse.json(addedProject);
};

export { POST };
