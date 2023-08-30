"use server";

import { NextResponse } from "next/server";

import apiError from "@/lib/apiError";
import project from "@/services/project";
import BaseRequest from "@/interfaces/requests/BaseRequest";

const GET = async (request: BaseRequest) => {
  const session = await request.session();

  if (!session) {
    return apiError(401);
  }

  const projects = await project.getProjects(session);

  return NextResponse.json(projects);
};

export { GET };
