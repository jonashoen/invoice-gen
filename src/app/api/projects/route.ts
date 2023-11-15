import { NextResponse } from "next/server";

import project from "@/services/project";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler = async (req) => {
  const userId = req.user;

  const projects = await project.getProjects(userId);

  return NextResponse.json(projects);
};

const GET = withMiddleware([authenticate], handler);

export { GET };
