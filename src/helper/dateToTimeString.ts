const dateToTimeString = (
  d?: Date | string,
  includeSeconds: boolean = false
) => {
  const date = typeof d === "string" ? new Date(d) : d ?? new Date();

  return date.toLocaleTimeString("de", {
    hour: "2-digit",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined,
  });
};

export default dateToTimeString;
