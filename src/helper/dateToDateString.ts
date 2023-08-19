const dateToDateString = (d?: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d ?? new Date();

  return date.toLocaleDateString("de", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default dateToDateString;
