const title = (title: string) => ({
  metadata: { title },
  layout: ({ children }: { children: React.ReactNode }) => children,
});

export default title;
