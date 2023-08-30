import Button from "@/components/Button";
import Info from "@/components/Info";
import dateToDateString from "@/helper/dateToDateString";
import numberToCurrencyString from "@/helper/numberToCurrencyString";
import sumPositions from "@/helper/sumPositions";
import taxes from "@/helper/taxes";
import useApiMutation from "@/hooks/useApiMutation";
import t from "@/i18n/t";
import { PublishInvoiceRequest } from "@/interfaces/requests/invoice";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import { Customer, Invoice, InvoicePosition, Project } from "@prisma/client";
import dayjs from "dayjs";
import { useState } from "react";

interface Props {
  invoice: Invoice & {
    project: Project & { customer: Customer };
    positions: InvoicePosition[];
  };
}

const CreateInvoice: React.FC<Props> = ({ invoice }) => {
  const hideModal = useModalStore((state) => state.hide);

  const publishInvoiceMutation = useApiMutation<PublishInvoiceRequest>({
    route: Api.PublishInvoice,
    invalidates: [Api.Invoices],
    onSuccess: hideModal,
    onError: () => {
      setError(
        "Beim Erstellen der Rechnung ist ein Fehler aufgetreten, bitte nochmal versuchen."
      );
    },
  });

  const [error, setError] = useState("");

  const publishInvoice = () => {
    setError("");

    publishInvoiceMutation.mutate({
      id: invoice.id,
    });
  };

  const invoiceSum = sumPositions(invoice.positions);

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Info severity="error" className="mt-4">
          {error}
        </Info>
      )}

      <p>
        <span className="text-xl">{invoice.project.customer.name}</span>{" "}
        <span>({invoice.project.name})</span>
      </p>

      <p>
        <span className="block">
          <span className="inline-block w-[210px]">Rechnungsdatum:</span>
          <span>{dateToDateString()}</span>
        </span>
        <span className="block">
          <span className="inline-block w-[210px]">Zahlungsziel:</span>
          <span>
            {dateToDateString(
              dayjs()
                .add(invoice.project.paymentDue, invoice.project.paymentDueUnit)
                .toDate()
            )}
          </span>
        </span>
      </p>

      <p className="mt-4">Positionen:</p>
      <table>
        <thead className="block border-black border-b pb-2">
          <tr className="flex">
            <td className="flex-[2]">Position</td>
            <td className="flex-[2]">Anzahl</td>
            <td className="flex-[2]">Einheit</td>
            <td className="flex-[6]">Beschreibung</td>
            <td className="flex-[3] text-right">Einzelpreis</td>
            <td className="flex-[4] text-right">Gesamtpreis</td>
          </tr>
        </thead>
        <tbody className="flex flex-col gap-4">
          {invoice.positions.map((position, i) => (
            <tr
              key={i}
              className={[
                "flex border-b py-4",
                i + 1 !== invoice.positions.length
                  ? "border-gray-300"
                  : "border-black",
              ].join(" ")}
            >
              <td className="flex-[2]">{i + 1}</td>
              <td className="flex-[2]">{position.amount}</td>
              <td className="flex-[2]">{t(position.unit)}</td>
              <td className="flex-[6] break-words">{position.description}</td>
              <td className="flex-[3] text-right">
                {numberToCurrencyString(position.price)}
              </td>
              <td className="flex-[4] text-right">
                {numberToCurrencyString(position.amount * position.price)}
              </td>
            </tr>
          ))}
          <tr className="flex justify-between">
            <td>Nettopreis</td>
            <td>{numberToCurrencyString(invoiceSum)}</td>
          </tr>
          <tr className="flex justify-between">
            <td>Zzgl. 19% USt.</td>
            <td>{numberToCurrencyString(taxes.calculate(invoiceSum))}</td>
          </tr>
          <tr className="flex justify-between border-t border-black pt-2 font-bold">
            <td>Rechnungsbetrag</td>
            <td>{numberToCurrencyString(taxes.addUp(invoiceSum))}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex flex-col mt-10 items-end gap-4">
        <Info severity="warning">
          Achtung, nach dem Erstellen kann die Rechnung nicht mehr bearbeitet
          werden!
        </Info>

        <Button
          className="bg-ice"
          onClick={publishInvoice}
          loading={publishInvoiceMutation.isLoading}
        >
          Erstellen
        </Button>
      </div>
    </div>
  );
};

export default CreateInvoice;
