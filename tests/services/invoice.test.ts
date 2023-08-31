import invoiceService from "@/services/invoice";
import { prismaMock } from "../__helper/mockDb";
import { Invoice, InvoicePosition, Project } from "@prisma/client";
import fs from "fs";

const pdfMockCreate = jest.fn();
const pdfMockGet = jest.fn();
jest.mock(
  "@/services/pdf",
  jest.fn().mockImplementation(() => ({
    createInvoice: () => pdfMockCreate(),
    getFile: () => pdfMockGet(),
  }))
);

const userId = -1;
const testInvoice: Invoice = {
  id: -1,
  projectId: -1,
  filename: "Test Filename",
  createdAt: new Date(),
  date: null,
  number: "0000/TC99/xxx",
  locked: false,
};

const testInvoicePosition: InvoicePosition = {
  id: -1,
  invoiceId: -1,
  amount: 1,
  unit: "hours",
  description: "Test Description",
  price: 1,
};

describe("Invoice service tests", () => {
  test("Get invoices", async () => {
    prismaMock.invoice.findMany.mockResolvedValueOnce([testInvoice]);

    const invoices = await invoiceService.getInvoices(userId);

    expect(invoices).toHaveLength(1);
    expect(invoices[0]).toEqual(testInvoice);
  });

  describe("Add invoice", () => {
    test("Project doesn't exist", async () => {
      prismaMock.project.findUnique.mockResolvedValueOnce(null);

      const invoice = await invoiceService.add(userId, {
        projectId: testInvoice.projectId,
        positions: [],
      });

      expect(invoice).toBeNull();
    });

    test("Valid input", async () => {
      prismaMock.project.findUnique.mockResolvedValueOnce({} as Project);
      prismaMock.invoice.create.mockResolvedValueOnce(testInvoice);

      const invoice = await invoiceService.add(userId, {
        projectId: testInvoice.projectId,
        positions: [],
      });

      expect(invoice).toEqual(testInvoice);
    });
  });

  describe("Edit invoice", () => {
    test("Invoice doesn't exist", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(null);

      const invoice = await invoiceService.edit(userId, {
        id: testInvoice.id,
      });

      expect(invoice).toBeNull();
    });

    test("Invoice is locked", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce({
        ...testInvoice,
        locked: true,
      });

      const invoice = await invoiceService.edit(userId, {
        id: testInvoice.id,
      });

      expect(invoice).toBeNull();
    });

    test("Positions to update don't match with db", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(testInvoice);
      prismaMock.invoicePosition.count.mockResolvedValueOnce(0);

      const invoice = await invoiceService.edit(userId, {
        id: testInvoice.id,
        positions: [testInvoicePosition],
      });

      expect(invoice).toBeNull();
    });

    test("Positions to delete don't match with db", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(testInvoice);
      prismaMock.invoicePosition.count.mockResolvedValueOnce(0);

      const invoice = await invoiceService.edit(userId, {
        id: testInvoice.id,
        deletedPositions: [testInvoicePosition.id],
      });

      expect(invoice).toBeNull();
    });

    test("Positions to add have undefined values", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(testInvoice);

      const invoice = await invoiceService.edit(userId, {
        id: testInvoice.id,
        positions: [{ ...testInvoicePosition, price: undefined, added: true }],
      });

      expect(invoice).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(testInvoice);
      prismaMock.invoicePosition.count.mockResolvedValueOnce(1);
      prismaMock.invoicePosition.count.mockResolvedValueOnce(1);
      prismaMock.invoice.update.mockResolvedValueOnce(testInvoice);

      const invoice = await invoiceService.edit(userId, {
        id: testInvoice.id,
        positions: [
          testInvoicePosition,
          { ...testInvoicePosition, added: true },
        ],
        deletedPositions: [1],
      });

      expect(invoice).toEqual(testInvoice);
    });

    test("Valid data partial update, no deletes", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(testInvoice);
      prismaMock.invoicePosition.count.mockResolvedValueOnce(1);
      prismaMock.invoicePosition.count.mockResolvedValueOnce(1);
      prismaMock.invoice.update.mockResolvedValueOnce(testInvoice);

      const invoice = await invoiceService.edit(userId, {
        id: testInvoice.id,
        positions: [
          testInvoicePosition,
          { ...testInvoicePosition, added: true },
        ],
      });

      expect(invoice).toEqual(testInvoice);
    });

    test("Valid data partial update, no updates", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(testInvoice);
      prismaMock.invoicePosition.count.mockResolvedValueOnce(1);
      prismaMock.invoicePosition.count.mockResolvedValueOnce(1);
      prismaMock.invoice.update.mockResolvedValueOnce(testInvoice);

      const invoice = await invoiceService.edit(userId, {
        id: testInvoice.id,
        deletedPositions: [1],
      });

      expect(invoice).toEqual(testInvoice);
    });

    test("Valid data partial update, no added", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(testInvoice);
      prismaMock.invoicePosition.count.mockResolvedValueOnce(1);
      prismaMock.invoicePosition.count.mockResolvedValueOnce(1);
      prismaMock.invoice.update.mockResolvedValueOnce(testInvoice);

      const invoice = await invoiceService.edit(userId, {
        id: testInvoice.id,
        positions: [testInvoicePosition],
        deletedPositions: [1],
      });

      expect(invoice).toEqual(testInvoice);
    });
  });

  describe("Delete invoice", () => {
    test("Invoice doesn't exist", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(null);

      const invoice = await invoiceService.deleteInvoice(userId, {
        id: testInvoice.id,
      });

      expect(invoice).toBeNull();
    });

    test("Invoice is locked", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce({
        ...testInvoice,
        locked: true,
      });

      const invoice = await invoiceService.deleteInvoice(userId, {
        id: testInvoice.id,
      });

      expect(invoice).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(testInvoice);
      prismaMock.invoice.delete.mockResolvedValueOnce(testInvoice);

      const invoice = await invoiceService.deleteInvoice(userId, {
        id: testInvoice.id,
      });

      expect(invoice).toEqual(testInvoice);
    });
  });

  describe("Publish invoice", () => {
    test("Invoice doesn't exist", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce(null);

      const invoice = await invoiceService.publish(userId, {
        id: testInvoice.id,
      });

      expect(invoice).toBeNull();
    });

    test("Invoice is locked", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce({
        ...testInvoice,
        locked: true,
      });

      const invoice = await invoiceService.publish(userId, {
        id: testInvoice.id,
      });

      expect(invoice).toBeNull();
    });

    test("File creation failed", async () => {
      prismaMock.invoice.findUnique.mockResolvedValueOnce({
        ...testInvoice,
        project: { customer: { id: -1 } },
      } as Invoice);

      pdfMockCreate.mockReturnValueOnce(null);

      const invoice = await invoiceService.publish(userId, {
        id: testInvoice.id,
      });

      expect(invoice).toBeNull();
    });

    test("File creation succeced", async () => {
      const filename = crypto.randomUUID();

      prismaMock.invoice.findUnique.mockResolvedValueOnce({
        ...testInvoice,
        project: { customer: { id: -1 } },
      } as any);

      pdfMockCreate.mockReturnValueOnce(filename);

      prismaMock.invoice.update.mockImplementationOnce(
        ({ data }) => Promise.resolve(data) as any
      );

      const invoice = await invoiceService.publish(userId, {
        id: testInvoice.id,
      });

      expect(invoice).not.toBeNull();
      expect(invoice!.filename).toBe(filename);
    });
  });

  describe("Get invoice", () => {
    test("Invoice doesn't exist", async () => {
      prismaMock.invoice.findFirst.mockResolvedValueOnce(null);

      const invoice = await invoiceService.get(userId, testInvoice.filename!);

      expect(invoice).toBeNull();
    });

    test("File doesn't exist", async () => {
      prismaMock.invoice.findFirst.mockResolvedValueOnce(testInvoice);

      pdfMockGet.mockReturnValueOnce(null);

      const invoice = await invoiceService.get(userId, testInvoice.filename!);

      expect(invoice).toBeNull();
    });

    test("Valid filename", async () => {
      prismaMock.invoice.findFirst.mockResolvedValueOnce(testInvoice);

      pdfMockGet.mockReturnValueOnce(fs.createReadStream(Buffer.from("")));

      const invoice = await invoiceService.get(userId, testInvoice.filename!);

      expect(invoice).toBeInstanceOf(ReadableStream);
    });
  });
});
