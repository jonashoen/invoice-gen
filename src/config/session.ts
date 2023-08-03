import parseDuration from "parse-duration";

const sessionConfig = {
  maxAge: parseDuration("2 weeks")!,
};

export default sessionConfig;
