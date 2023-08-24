import parseDuration from "parse-duration";

const signKey = process.env.COOKIE_SIGNATURE_KEY;
if (!signKey) {
  throw Error("No cookie signature key specified in .env file!");
}

const sessionConfig = {
  cookieName: "sid",
  signKey,
  maxAge: parseDuration("2 weeks", "sec")!,
};

export default sessionConfig;
