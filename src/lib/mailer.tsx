import nodemailer from "nodemailer";
import mailerConfig from "@/config/mailer";
import { render } from "@react-email/render";
import VerifyAccountEmail from "@/emails/verify-account";

const transporter = nodemailer.createTransport({
  host: mailerConfig.host,
  port: mailerConfig.port,
  secure: true,
  auth: {
    user: mailerConfig.user,
    pass: mailerConfig.password,
  },
});

const sendVerificationMail = async ({
  to,
  token,
}: {
  to: string;
  token: string;
}) => {
  try {
    const html = render(<VerifyAccountEmail token={token} />);
    const text = render(<VerifyAccountEmail token={token} />, {
      plainText: true,
    });

    return await transporter.sendMail({
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

export default { sendVerificationMail };
