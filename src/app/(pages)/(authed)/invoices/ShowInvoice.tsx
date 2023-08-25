import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Api, { Prefix } from "@/routes/Api";

interface Props {
  filename: string;
  number: string;
}

const ShowInvoice: React.FC<Props> = ({ filename, number }) => {
  return (
    <>
      <div className="absolute z-10 left-1/2 top-1/4 -translate-x-1/2">
        <Loader />
      </div>

      <div className="flex flex-col flex-grow bg-white mt-10 gap-2">
        <Button>
          <a
            href={`${Prefix}${Api.ShowInvoice}/${filename}`}
            download={`${number}.pdf`}
          >
            Download
          </a>
        </Button>

        <object
          data={`${Prefix}${Api.ShowInvoice}/${filename}#toolbar=0`}
          type="application/pdf"
          className="flex flex-col w-full flex-grow z-20"
        >
          <p className="flex-grow text-2xl bg-white text-center text-red-500 font-bold">
            PDF konnte nicht geladen werden.
          </p>
        </object>
      </div>
    </>
  );
};

export default ShowInvoice;
