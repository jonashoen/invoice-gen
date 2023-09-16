import BaseRequest from "./BaseRequest";

type RequestHandler<TRequest = unknown> = (
  req: BaseRequest<TRequest>
) => Promise<Response>;

export default RequestHandler;
