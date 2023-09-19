import { Lexend_Mega } from "next/font/google";

import "./globals.css";
import Provider from "@/components/Provider";

const lexendMega = Lexend_Mega({
  subsets: ["latin"],
  display: "swap",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="de">
      <body className={["bg-yellow", lexendMega.className].join(" ")}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
};

export default RootLayout;
