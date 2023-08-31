import password from "@/lib/password";

describe("Password tests", () => {
  describe("Hash and verify password", () => {
    test("Incorrect password", () => {
      const plainCorrect = "Test Password";
      const plainIncorrect = "Test Password invalid";

      const hash = password.hash(plainCorrect);

      expect(password.compare(plainIncorrect, hash)).toBe(false);
    });

    test("Correct password", () => {
      const plain = "Test Password";

      const hash = password.hash(plain);

      expect(password.compare(plain, hash)).toBe(true);
    });
  });
});
