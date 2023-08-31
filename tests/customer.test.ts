import customerService from "@/services/customer";
import { prismaMock } from "./helper/mockDb";
import { Customer } from "@prisma/client";

const testCustomer: Customer = {
  id: -1,
  userId: -1,
  name: "Test Customer",
  number: "TC99",
  city: "Test City",
  zipCode: "Test Zip Code",
  street: "Test Street",
  houseNumber: "Test House Number",
};

describe("Customer service tests", () => {
  test("Get customers", async () => {
    prismaMock.customer.findMany.mockResolvedValueOnce([testCustomer]);

    const receivedCustomers = await customerService.getCustomers(-1);

    expect(receivedCustomers).toHaveLength(1);
    expect(receivedCustomers[0]).toEqual(testCustomer);
  });

  describe("Add customer", () => {
    test("Customer number or name exists for current user", async () => {
      prismaMock.customer.findFirst.mockResolvedValueOnce({} as Customer);

      const customer = await customerService.addCustomer(
        testCustomer.userId,
        testCustomer
      );

      expect(customer).toBeNull();
    });

    test("Valid input", async () => {
      prismaMock.customer.findFirst.mockResolvedValueOnce(null);
      prismaMock.customer.create.mockResolvedValueOnce(testCustomer);

      const customer = await customerService.addCustomer(
        testCustomer.userId,
        testCustomer
      );

      expect(customer).toEqual(testCustomer);
    });
  });

  describe("Edit customer", () => {
    test("Customer does't exist", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce(null);

      const customer = await customerService.editCustomer(
        testCustomer.userId,
        testCustomer
      );

      expect(customer).toBeNull();
    });

    test("New name already exists", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce(testCustomer);
      prismaMock.customer.findUnique.mockResolvedValueOnce(testCustomer);

      const customer = await customerService.editCustomer(testCustomer.userId, {
        ...testCustomer,
        name: "Another test name",
      });

      expect(customer).toBeNull();
    });

    test("New number already exists", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce(testCustomer);
      prismaMock.customer.findUnique.mockResolvedValueOnce(testCustomer);

      const customer = await customerService.editCustomer(testCustomer.userId, {
        ...testCustomer,
        number: "Another test number",
      });

      expect(customer).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce(testCustomer);
      prismaMock.customer.findUnique.mockResolvedValueOnce(null);
      prismaMock.customer.update.mockResolvedValueOnce(testCustomer);

      const customer = await customerService.editCustomer(
        testCustomer.userId,
        testCustomer
      );

      expect(customer).toEqual(testCustomer);
    });
  });

  describe("Delete customer", () => {
    test("Customer doesn't exist", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce(null);

      const customer = await customerService.deleteCustomer(
        testCustomer.userId,
        testCustomer
      );

      expect(customer).toBeNull();
    });

    test("Customer has assigned at least one project", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce({
        ...testCustomer,
        _count: { projects: 1 },
      } as any);

      const customer = await customerService.deleteCustomer(
        testCustomer.userId,
        testCustomer
      );

      expect(customer).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce({
        ...testCustomer,
        _count: { projects: 0 },
      } as any);
      prismaMock.customer.delete.mockResolvedValueOnce(testCustomer);

      const customer = await customerService.deleteCustomer(
        testCustomer.userId,
        testCustomer
      );

      expect(customer).toEqual(testCustomer);
    });
  });
});
