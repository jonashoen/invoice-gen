import { Tailwind } from "@react-email/tailwind";
import { Html } from "@react-email/html";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Font } from "@react-email/font";
import { Preview } from "@react-email/preview";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";

import tailwindConfig from "../../tailwind.config";

interface Props {
  code: string;
}

const ResetPasswordEmail: React.FC<Props> = ({ code }) => {
  return (
    <Tailwind config={tailwindConfig as any}>
      <Html lang="de" className="bg-white p-4 pt-8">
        <Head>
          <Font
            fontFamily="Lexend Mega"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/lexendmega/v24/qFdX35aBi5JtHD41zSTFEuTByuvYFuE9IbDL8fmfuuaj.woff2",
              format: "woff2",
            }}
          />
          <Font
            fontFamily="Lexend Mega"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/lexendmega/v24/qFdA35aBi5JtHD41zSTFEs7N4ho.woff2",
              format: "woff2",
            }}
            fontWeight="bold"
          />
        </Head>

        <Preview>Passwort für deinen invoice-gen Account zurücksetzen</Preview>

        <Container>
          <table className="w-full">
            <tbody>
              <tr className="-rotate-3 bg-orange block border-black border-solid border-[3px] border-r-[6px] border-b-[6px] rounded-[48px] p-1.5 mx-auto w-fit">
                <td className="border-black border-solid border-[3px] rounded-[48px] px-3">
                  <h1 className="font-bold text-xl text-white">invoice-gen</h1>
                </td>
              </tr>
            </tbody>
          </table>

          <Heading as="h1" className="text-center">
            Passwort zurücksetzen
          </Heading>
          <Text className="text-center">
            Bitte nutze den folgenden Code um dein Passwort zurückzusetzen:
          </Text>
          <Section className="bg-black rounded-lg w-fit px-2">
            <Text className="text-center text-white text-lg font-bold">
              {code}
            </Text>
          </Section>
        </Container>
      </Html>
    </Tailwind>
  );
};

export default ResetPasswordEmail;
