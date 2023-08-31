import projectService from "@/services/project";
import { prismaMock } from "../__helper/mockDb";
import { Customer, Project } from "@prisma/client";

const userId = -1;
const testProject: Project = {
  id: -1,
  customerId: -1,
  name: "Test Name",
  paymentDue: 1,
  paymentDueUnit: "days",
};

describe("Customer service tests", () => {
  test("Get customers", async () => {
    prismaMock.project.findMany.mockResolvedValueOnce([testProject]);

    const project = await projectService.getProjects(userId);

    expect(project).toHaveLength(1);
    expect(project[0]).toEqual(testProject);
  });

  describe("Add project", () => {
    test("Customer doesn't exist", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce(null);

      const project = await projectService.add(userId, testProject);

      expect(project).toBeNull();
    });

    test("Project name already exists for customer", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce({} as Customer);
      prismaMock.project.findUnique.mockResolvedValueOnce(testProject);

      const project = await projectService.add(userId, testProject);

      expect(project).toBeNull();
    });

    test("Valid input", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce({} as Customer);
      prismaMock.project.findUnique.mockResolvedValueOnce(null);
      prismaMock.project.create.mockResolvedValueOnce(testProject);

      const project = await projectService.add(userId, testProject);

      expect(project).toEqual(testProject);
    });
  });

  describe("Edit project", () => {
    test("Project doesn't exist", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce(null);

      const project = await projectService.edit(userId, testProject);

      expect(project).toBeNull();
    });

    test("Project doesn't exist", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce({} as Customer);
      prismaMock.project.findUnique.mockResolvedValueOnce(null);

      const project = await projectService.edit(userId, testProject);

      expect(project).toBeNull();
    });

    test("Project name already exists for customer", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce({} as Customer);
      prismaMock.project.findUnique.mockResolvedValueOnce(testProject);
      prismaMock.project.findUnique.mockResolvedValueOnce(testProject);

      const project = await projectService.edit(userId, {
        ...testProject,
        name: "Another Test Name",
      });

      expect(project).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.customer.findUnique.mockResolvedValueOnce({} as Customer);
      prismaMock.project.findUnique.mockResolvedValueOnce(testProject);
      prismaMock.project.findUnique.mockResolvedValueOnce(null);
      prismaMock.project.update.mockResolvedValueOnce(testProject);

      const project = await projectService.edit(userId, {
        ...testProject,
        customerId: undefined,
      });

      expect(project).toEqual(testProject);
    });
  });

  describe("Delete project", () => {
    test("Project doesn't exist", async () => {
      prismaMock.project.findFirst.mockResolvedValueOnce(null);

      const project = await projectService.deleteProject(userId, testProject);

      expect(project).toBeNull();
    });

    test("Project has atleast one user assigned", async () => {
      prismaMock.project.findFirst.mockResolvedValueOnce({
        ...testProject,
        _count: { invoices: 1 },
      } as any);

      const project = await projectService.deleteProject(userId, testProject);

      expect(project).toBeNull();
    });

    test("Valid input", async () => {
      prismaMock.project.findFirst.mockResolvedValueOnce({
        ...testProject,
        _count: { invoices: 0 },
      } as any);

      prismaMock.project.delete.mockResolvedValueOnce(testProject);

      const project = await projectService.deleteProject(userId, testProject);

      expect(project).toEqual(testProject);
    });
  });
});
