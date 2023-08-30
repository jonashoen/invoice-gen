import { convertFromDirectory } from "joi-to-typescript";

convertFromDirectory({
  schemaDirectory: "./src/schemas",
  typeOutputDirectory: "./src/interfaces/requests",
  schemaFileSuffix: "Schemas",
});
