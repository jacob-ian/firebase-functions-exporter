import { exportFunctions } from "../src";
import { writeFile, rm, mkdir } from "fs/promises";

const EXPECTED_FUNCTIONS = ["app", "onUserCreate", "createUser"];

const ON_USER_CREATE_FN = `
import * as functions from "firebase-functions";

export const onUserCreate = functions.auth.user().onCreate(() => {});
`;

describe("exportFunctions", () => {
  const generatedDir = `${__dirname}/generated`;

  beforeEach(async () => {
    await rm(generatedDir, { recursive: true, force: true });
  });

  it("Should return an object with the keys matching the name of the functions", () => {
    const functions = exportFunctions();
    const sortedFunctions = Object.keys(functions).sort((a, b) => a.localeCompare(b));
    EXPECTED_FUNCTIONS.sort((a, b) => a.localeCompare(b));
    expect(sortedFunctions).toEqual(EXPECTED_FUNCTIONS);
  });

  it("Should throw an error if a function with the same name appears twice", async () => {
    await mkdir(generatedDir);
    const testFilePath = `${generatedDir}/onUserCreate.function.ts`;
    await writeFile(testFilePath, Buffer.from(ON_USER_CREATE_FN), "utf-8");
    expect(() => exportFunctions()).toThrow(
      new Error("Firebase Functions must have unique names. Please rename onUserCreate.")
    );
    await rm(generatedDir, { recursive: true, force: true });
  });
});
