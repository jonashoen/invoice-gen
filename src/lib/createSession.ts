const createSession = (sessionId: string) =>
  new Response(null, {
    headers: [["sid", sessionId]],
  });

export default createSession;
