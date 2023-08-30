import t from "@/i18n/t";
import { PaymentDueUnit } from "@prisma/client";

const paymentDueToString = ({
  paymentDue,
  paymentDueUnit,
}: {
  paymentDue: number;
  paymentDueUnit: PaymentDueUnit;
}) => {
  return (
    `${paymentDue} ${t(paymentDueUnit)}` +
    (paymentDueUnit === "days" || paymentDueUnit === "months" ? "n" : "")
  );
};

export default paymentDueToString;
