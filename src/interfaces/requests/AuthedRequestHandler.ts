import Authed from "./AuthedRequest";
import BaseRequest from "./BaseRequest";

type AuthedRequestHandler<TBody = undefined, TParams = undefined> = (
  req: Authed<BaseRequest<TBody, TParams>>
) => Promise<Response>;

export default AuthedRequestHandler;
