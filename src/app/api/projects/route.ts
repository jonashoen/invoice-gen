"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import { StatusCodes } from "http-status-codes";
import isAuthed from "@/lib/isAuthed";

const GET = async () => {
  const session = await isAuthed();

  if (!session) {
    return apiError(StatusCodes.UNAUTHORIZED);
  }

  const projects = await project.getProjects(session);

  return NextResponse.json(projects);
};

export { GET };
