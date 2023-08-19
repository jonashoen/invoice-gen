import dateToDateString from "@/helper/dateToDateString";
import numberToCurrencyString from "@/helper/numberToCurrencyString";
import sumPositions from "@/helper/sumPositions";
import taxes from "@/helper/taxes";
import {
  Customer,
  Invoice,
  InvoicePosition,
  PaymentDueUnit,
  User,
} from "@prisma/client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@joshuajaco/react-pdf-renderer-bundled";
import Girocode from "react-girocode";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/de";

import PdfSvg from "@/pdf/PdfSvg";
import { ReactElement } from "react";
import t from "@/i18n/t";

dayjs.extend(relativeTime);
dayjs.locale("de");

const accent = "#66f";

const styles = StyleSheet.create({
  page: {
    paddingBottom: "3.5cm",
    fontFamily: "Open Sans",
    fontSize: 10,
    fontWeight: "light",
  },
  regular: {
    fontWeight: "normal",
  },
  bold: {
    fontWeight: "bold",
  },
  accent: {
    color: accent,
  },
  uppercase: {
    textTransform: "uppercase",
  },
  wrapper: {
    paddingLeft: "2.41cm",
    paddingRight: "2.3cm",
  },
  logo: {
    flexDirection: "row",
    paddingTop: "1.25cm",
    paddingBottom: "0.25cm",
    marginBottom: "0.5cm",
    height: "4.5cm",
    backgroundColor: accent,
  },
  filler: {
    flexGrow: 1,
  },
  addresses: {
    flexDirection: "row",
  },
  address: {
    flex: 1,
  },
  toFrom: {
    marginBottom: 4,
  },
  addressName: {
    marginBottom: 2,
  },
  right: {
    textAlign: "right",
  },
  invoiceInfo: {
    marginTop: 24,
  },
  invoiceInfoEntry: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  invoiceInfoKey: {
    textAlign: "right",
    width: "20%",
  },
  invoiceInfoValue: {
    width: "22%",
  },
  headline: {
    marginTop: 8,
    fontSize: 20,
  },
  greeting: {
    marginTop: 12,
  },
  introduction: {
    marginTop: 4,
  },
  table: { marginTop: 12 },
  tableHead: {
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 4,
  },
  flex1: {
    flex: 3,
  },
  flex1_5: {
    flex: 3.75,
  },
  flex2: {
    flex: 6,
  },
  flex3: {
    flex: 8,
  },
  tableRow: {
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  positions: {
    marginBottom: 2,
  },
  position: {
    borderBottom: 0.5,
  },
  tablePrices: {
    paddingVertical: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billingNote: {
    marginTop: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: "2.41cm",
    right: "2.3cm",
    justifyContent: "flex-end",
  },
  girocode: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footerColumns: {
    fontSize: 8,
    opacity: 0.85,
    borderTop: 0.5,
    height: "3cm",
    flexDirection: "row",
    paddingBottom: "1cm",
    paddingTop: "0.5cm",
    marginTop: "0.5cm",
  },
});

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://raw.githubusercontent.com/googlefonts/opensans/main/fonts/ttf/OpenSans-Regular.ttf",
    },
    {
      src: "https://raw.githubusercontent.com/googlefonts/opensans/main/fonts/ttf/OpenSans-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://raw.githubusercontent.com/googlefonts/opensans/main/fonts/ttf/OpenSans-Light.ttf",
      fontWeight: "light",
    },
  ],
});

const Logo = () => (
  <View style={[styles.logo, styles.wrapper]} fixed>
    <View style={styles.filler} />
    <Image style={{ display: "none" }} src="./src/pdf/monke.png" />
  </View>
);

const Head = ({
  customer,
  user,
  project,
  invoiceNumber,
}: {
  customer: Customer;
  user: User;
  project: { paymentDue: number; paymentDueUnit: PaymentDueUnit };
  invoiceNumber: string;
}) => (
  <View style={styles.wrapper}>
    <View style={styles.addresses}>
      <View style={styles.address}>
        <Text style={[styles.toFrom, styles.uppercase]}>An</Text>
        <View>
          <Text style={[styles.addressName, styles.bold, styles.accent]}>
            {customer.name}
          </Text>
          <Text>
            {customer.street} {customer.houseNumber}
          </Text>
          <Text>
            {customer.zipCode} {customer.city}
          </Text>
        </View>
      </View>
      <View style={styles.address}>
        <Text style={[styles.toFrom, styles.right, styles.uppercase]}>Von</Text>
        <View style={[styles.right]}>
          <Text style={[styles.addressName, styles.bold, styles.accent]}>
            {user.firstName} {user.lastName}
          </Text>
          <Text>
            {user.street} {user.houseNumber}
          </Text>
          <Text>
            {user.zipCode} {user.city}
          </Text>
        </View>
      </View>
    </View>
    <View style={styles.right}>
      <View style={styles.invoiceInfo}>
        <View
          style={[
            styles.invoiceInfoEntry,
            styles.bold,
            styles.uppercase,
            styles.accent,
          ]}
        >
          <Text>Rechnung {invoiceNumber}</Text>
        </View>
        <View style={styles.invoiceInfoEntry}>
          <Text style={styles.invoiceInfoKey}>Rechnungsdatum:</Text>
          <Text style={styles.invoiceInfoValue}>{dateToDateString()}</Text>
        </View>
        <View style={styles.invoiceInfoEntry}>
          <Text style={styles.invoiceInfoKey}>Leistungsdatum:</Text>
          <Text style={styles.invoiceInfoValue}>{dateToDateString()}</Text>
        </View>
        <View style={styles.invoiceInfoEntry}>
          <Text style={styles.invoiceInfoKey}>Zahlungsziel:</Text>
          <Text style={styles.invoiceInfoValue}>
            {dateToDateString(
              dayjs
                .utc()
                .add(project.paymentDue, project.paymentDueUnit)
                .toDate()
            )}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const Main = ({
  positions,
  project,
  user,
}: {
  positions: InvoicePosition[];
  project: { paymentDue: number; paymentDueUnit: PaymentDueUnit };
  user: User;
}) => {
  const invoiceSum = sumPositions(positions);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.headline, styles.uppercase]}>Rechnung</Text>
      <Text style={styles.greeting}>Sehr geehrte Damen und Herren,</Text>
      <Text style={styles.introduction}>
        im Folgenden die erworbenen Leistungen, die ich Ihnen in Rechnung
        stelle:
      </Text>
      <View style={styles.table}>
        <View
          style={[
            styles.tableHead,
            styles.uppercase,
            styles.regular,
            styles.accent,
          ]}
          fixed
        >
          <Text style={styles.flex1}>Position</Text>
          <Text style={styles.flex1}>Anzahl</Text>
          <Text style={styles.flex1}>Einheit</Text>
          <Text style={styles.flex3}>Bezeichnung</Text>
          <Text style={[styles.flex1_5, styles.right]}>Einzelpreis</Text>
          <Text style={[styles.flex2, styles.right]}>Gesamtpreis</Text>
        </View>
        <View style={styles.positions}>
          {positions.map((position, i) => (
            <View style={[styles.tableRow, styles.position]} key={i}>
              <Text style={styles.flex1}>{i + 1}</Text>
              <Text style={styles.flex1}>{position.amount}</Text>
              <Text style={styles.flex1}>{t(position.unit)}</Text>
              <Text style={styles.flex3}>{position.description}</Text>
              <Text style={[styles.flex1_5, styles.right]}>
                {numberToCurrencyString(position.price)}
              </Text>
              <Text style={[styles.flex2, styles.right]}>
                {numberToCurrencyString(position.amount * position.price)}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View wrap={false}>
        <View style={[styles.tablePrices, styles.uppercase]}>
          <Text>Nettopreis</Text>
          <Text style={styles.right}>{numberToCurrencyString(invoiceSum)}</Text>
        </View>
        <View style={[styles.tablePrices, styles.uppercase]}>
          <Text>Zzgl. 19% USt.</Text>
          <Text style={styles.right}>
            {numberToCurrencyString(taxes.calculate(invoiceSum))}
          </Text>
        </View>
        <View
          style={[
            styles.tablePrices,
            styles.bold,
            styles.uppercase,
            styles.accent,
          ]}
        >
          <Text>Rechnungsbetrag</Text>
          <Text style={styles.right}>
            {numberToCurrencyString(taxes.addUp(invoiceSum))}
          </Text>
        </View>
      </View>
      <View wrap={false}>
        <View style={styles.billingNote}>
          <Text>
            Bitte überweisen Sie den Rechnungsbetrag unter Angabe der
            Rechnungsnummer innerhalb{" "}
            {dayjs()
              .add(project.paymentDue, project.paymentDueUnit)
              .fromNow()
              .replace("in", "von")}{" "}
            auf das unten genannte Konto.
          </Text>
          <Text>
            Für weitere Rückfragen stehe ich Ihnen gerne zur Verfügung.
          </Text>
        </View>
        <View style={styles.billingNote}>
          <Text>Liebe Grüße</Text>
          <Text>
            {user.firstName} {user.lastName}
          </Text>
        </View>
      </View>
    </View>
  );
};

const Footer = ({
  user,
  invoiceNumber,
  sumIncludingTaxes,
  renderToStaticMarkup,
}: {
  user: User;
  invoiceNumber: string;
  sumIncludingTaxes: number;
  renderToStaticMarkup: (element: ReactElement) => string;
}) => {
  return (
    <View style={styles.footer} fixed>
      <View style={styles.girocode}></View>
      <View style={styles.footerColumns}>
        <View style={styles.flex1_5}>
          <Text>
            {user.firstName} {user.lastName}
          </Text>
          <Text>
            {user.street} {user.houseNumber}
          </Text>
          <Text>
            {user.zipCode} {user.city}
          </Text>
          {user.vatId ? (
            <Text>USt-IdNr.: {user.vatId}</Text>
          ) : (
            <Text>St.-Nr.: {user.taxNumber}</Text>
          )}
        </View>
        <View style={styles.flex2}>
          <Text>Tel.: {user.telephone}</Text>
          <Text>E-Mail: {user.email}</Text>
        </View>
        <View style={styles.flex2}>
          <Text>Kreditinstitut: {user.bank}</Text>
          <Text>IBAN: {user.iban}</Text>
          <Text>BIC: {user.bic}</Text>
          <Text>
            Kontoinhaber: {user.firstName} {user.lastName}
          </Text>
        </View>
        <PdfSvg renderToStaticMarkup={renderToStaticMarkup} width={44}>
          <Girocode
            iban={user.iban}
            recipient={`${user.firstName} ${user.lastName}`}
            text={invoiceNumber}
            amount={sumIncludingTaxes}
          />
        </PdfSvg>
      </View>
    </View>
  );
};

interface Props {
  invoice: Invoice & {
    project: {
      paymentDue: number;
      paymentDueUnit: PaymentDueUnit;
      customer: Customer & { user: User };
    };
    positions: InvoicePosition[];
  };
  number: string;
  renderToStaticMarkup: (element: ReactElement) => string;
}

const Invoice: React.FC<Props> = ({
  invoice,
  number,
  renderToStaticMarkup,
}) => {
  const sumIncludingTaxes = taxes.addUp(sumPositions(invoice.positions));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Logo />
        <Head
          customer={invoice.project.customer}
          user={invoice.project.customer.user}
          project={invoice.project}
          invoiceNumber={number}
        />
        <Main
          positions={invoice.positions}
          project={invoice.project}
          user={invoice.project.customer.user}
        />
        <Footer
          user={invoice.project.customer.user}
          invoiceNumber={number}
          sumIncludingTaxes={sumIncludingTaxes}
          renderToStaticMarkup={renderToStaticMarkup}
        />
      </Page>
    </Document>
  );
};

export default Invoice;
