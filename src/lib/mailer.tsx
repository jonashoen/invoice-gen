import nodemailer from "nodemailer";
import mailerConfig from "@/config/mailer";
import { render } from "@react-email/render";
import VerifyAccountEmail from "@/emails/verify-account";
import ResetPasswordEmail from "@/emails/reset-password";

const sendVerificationMail = async ({
  to,
  code,
}: {
  to: string;
  code: string;
}) => {
  try {
    const html = render(<VerifyAccountEmail code={code} />);
    const text = render(<VerifyAccountEmail code={code} />, {
      plainText: true,
    });

    return await createTransport().sendMail({
      from: {
        name: mailerConfig.from.name,
        address: mailerConfig.from.email,
      },
      to,
      subject: "invoice-gen - Account verifizieren",
      html,
      text,
    });
  } catch (err) {
    console.error(err);

    return null;
  }
};

const sendResetPasswordMail = async ({
  to,
  code,
}: {
  to: string;
  code: string;
}) => {
  try {
    const html = render(<ResetPasswordEmail code={code} />);
    const text = render(<ResetPasswordEmail code={code} />, {
      plainText: true,
    });

    return await createTransport().sendMail({
      from: {
        name: mailerConfig.from.name,
        address: mailerConfig.from.email,
      },
      to,
      subject: "invoice-gen - Passwort zurücksetzen",
      html,
      text,
    });
  } catch (err) {
    console.error(err);

    return null;
  }
};

export default { sendVerificationMail, sendResetPasswordMail };

const createTransport = () => {
  return nodemailer.createTransport({
    host: mailerConfig.host,
    port: mailerConfig.port,
    secure: true,
    auth: {
      user: mailerConfig.user,
      pass: mailerConfig.password,
    },
  });
};
