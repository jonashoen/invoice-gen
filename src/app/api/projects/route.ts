"use server";

import { NextResponse } from "next/server";

import isAuthed from "@/lib/isAuthed";
import apiError from "@/lib/apiError";
import project from "@/services/project";

const GET = async () => {
  const session = await isAuthed();

  if (!session) {
    return apiError(401);
  }

  const projects = await project.getProjects(session);

  return NextResponse.json(projects);
};

export { GET };
