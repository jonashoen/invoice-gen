import { NextResponse } from "next/server";
import BaseRequest from "./BaseRequest";

type RequestHandler<TRequest = unknown> = (
  req: BaseRequest<TRequest>,
  res: NextResponse
) => Promise<Response>;

export default RequestHandler;
