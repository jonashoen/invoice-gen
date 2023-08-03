const apiError = (status: number) =>
  new Response(null, {
    status,
  });

export default apiError;
