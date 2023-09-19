import BaseRequest from "./BaseRequest";

type RequestHandler<TBody = undefined, TParams = undefined> = (
  req: BaseRequest<TBody, TParams>
) => Promise<Response>;

export default RequestHandler;
