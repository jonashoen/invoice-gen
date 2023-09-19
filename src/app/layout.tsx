import "@fontsource/lexend-mega";
import "@fontsource/lexend-mega/700.css";
import "@fontsource/lexend-mega/900.css";

import "./globals.css";
import Provider from "@/components/Provider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="de">
      <body className="bg-yellow">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
};

export default RootLayout;
