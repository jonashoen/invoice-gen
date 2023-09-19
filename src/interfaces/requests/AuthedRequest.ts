type Authed<TRequest> = TRequest & { user: number };

export default Authed;
