"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";
import { EditProjectRequest } from "@/interfaces/requests/project";

const POST = async (request: BaseRequest<EditProjectRequest>) => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const body = await request.json();

  const editedProject = await project.edit(session, body);

  if (!editedProject) {
    return apiError(400);
  }

  return NextResponse.json(editedProject);
};

export { POST };
