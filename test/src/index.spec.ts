import * as index from "./index";

const EXPECTED_FUNCTIONS = ["app", "onUserCreate", "createUser"];

describe("index exports usage", () => {
  beforeAll(() => {
    EXPECTED_FUNCTIONS.sort((a, b) => a.localeCompare(b));
  });

  it("Should return an object type", () => {
    expect(typeof index).toBe("object");
  });

  it("Should return a map of exports with a default that has keys matching the name of each firebase function", () => {
    const keys = Object.keys((index as any).default);
    keys.sort((a, b) => a.localeCompare(b));
    expect(keys).toEqual(EXPECTED_FUNCTIONS);
  });

  it("Should return a map of functions", () => {
    const exportValues = Object.values((index as any).default);
    expect(exportValues.every((value) => typeof value === "function"));
  });
});
