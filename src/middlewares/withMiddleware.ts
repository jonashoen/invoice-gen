import BaseRequest from "@/interfaces/requests/BaseRequest";
import RequestHandler from "@/interfaces/requests/RequestHandler";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

type Middleware<TBody, TParams> = (
  req: BaseRequest<TBody, TParams>,
  next: () => Promise<Response>
) => Promise<Response>;

const withMiddleware = <TBody, TParams>(
  middlewares: Middleware<TBody, TParams>[],
  handler: RequestHandler<TBody, TParams> | AuthedRequestHandler<TBody, TParams>
) => {
  return async (
    req: BaseRequest<TBody, TParams>,
    params: { params: TParams }
  ) => {
    let currentMiddlewareIndex = 0;

    req.params = params.params;

    const next = () => {
      const middleware = middlewares[currentMiddlewareIndex++] ?? handler;

      return middleware(req, next);
    };

    return await next();
  };
};

export default withMiddleware;

export type { Middleware };
