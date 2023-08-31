import fs, { ReadStream } from "fs";
import ReactPDF from "@joshuajaco/react-pdf-renderer-bundled";
import pdfService from "@/services/pdf";

jest.mock("@joshuajaco/react-pdf-renderer-bundled");
jest.mock("fs");

describe("PDF Service tests", () => {
  describe("Create pdf", () => {
    test("Creation failed", async () => {
      (ReactPDF.renderToFile as jest.Mock).mockRejectedValueOnce(undefined);

      const filename = await pdfService.createInvoice(
        {} as any,
        "0000/TC99/xxx"
      );

      expect(filename).toBeNull();
    });

    test("Creation succeded", async () => {
      (ReactPDF.renderToFile as jest.Mock).mockResolvedValueOnce("");

      const filename = await pdfService.createInvoice(
        {} as any,
        "0000/TC99/xxx"
      );

      expect(typeof filename).toBe("string");
    });
  });

  describe("Get pdf file", () => {
    test("File doesn't exist", () => {
      (fs.createReadStream as jest.Mock).mockImplementationOnce(() => {
        throw Error();
      });

      const file = pdfService.getFile("Some filename");

      expect(file).toBeNull();
    });

    test("Valid filename", () => {
      const file = pdfService.getFile("Some filename");

      expect(fs.createReadStream as jest.Mock).toHaveBeenCalledTimes(1);
      expect(file).not.toBeNull();
    });
  });
});
