import BaseRequest from "./BaseRequest";

type RequestHandler<TBody = unknown, TParams = undefined> = (
  req: BaseRequest<TBody>,
  params: { params: TParams }
) => Promise<Response>;

export default RequestHandler;
