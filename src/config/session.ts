import parseDuration from "parse-duration";

const sessionConfig = {
  cookieName: "sid",
  maxAge: parseDuration("2 weeks", "sec")!,
};

export default sessionConfig;
