import { NextRequest } from "next/server";

interface BaseRequest<T> extends NextRequest {
  user?: number;
  data?: T;
}

export default BaseRequest;
