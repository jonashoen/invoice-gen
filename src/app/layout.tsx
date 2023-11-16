import Body from "@/components/Body";
import "./globals.css";
import Provider from "@/components/Provider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="de">
      <Body>
        <Provider>{children}</Provider>
      </Body>
    </html>
  );
};

export default RootLayout;
