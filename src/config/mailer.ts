const host = process.env.MAIL_HOST;
if (!host) {
  throw Error("No mailer host specified in .env file!");
}

const port = parseInt(process.env.MAIL_PORT ?? "");
if (isNaN(port)) {
  throw Error("No mailer port specified in .env file!");
}

const user = process.env.MAIL_USER;
if (!user) {
  throw Error("No mail user specified in .env file!");
}

const password = process.env.MAIL_PASSWORD;
if (!password) {
  throw Error("No mail password specified in .env file!");
}

const fromEmail = process.env.MAIL_FROM;
if (!fromEmail) {
  throw Error("No from mail adress specified in .env file!");
}

const mailerConfig = {
  host,
  port,
  user,
  password,
  from: {
    name: "invoice-gen",
    email: fromEmail,
  },
};

export default mailerConfig;
