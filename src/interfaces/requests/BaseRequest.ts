import { NextRequest } from "next/server";

interface BaseRequest<TBody, TParams> extends NextRequest {
  params: TParams;
  data: TBody;
}

export default BaseRequest;
