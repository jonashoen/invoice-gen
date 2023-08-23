import parseDuration from "parse-duration";

const passwordConfig = {
  maxAge: parseDuration("2 days", "sec")!,
};

export default passwordConfig;
