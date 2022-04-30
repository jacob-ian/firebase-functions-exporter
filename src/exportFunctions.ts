import { sync as globSync } from "glob";

// tslint:disable-next-line ban-types
type FirebaseFunction = Function;

interface Module {
  name: string;
  module: any;
}

interface ExportedFirebaseFunction {
  name: string;
  fn: FirebaseFunction;
}

/**
 * Exports all JS/TS Firebase Functions in all subdirectories
 * matching the filename pattern '{functionName}.function.{js,ts}'.
 * @example
 * // Given the following:
 * reactive
 *   onUserCreate.function.ts
 *   notAFunction.ts
 * callable
 *   users
 *    getUser.function.ts
 *    deleteUser.function.ts
 *   emails
 *    sendEmail.function.ts
 *    Emailer.ts
 *
 * // These functions will be exported
 * ['onUserCreate', 'getUser', 'deleteUser', 'sendEmail']
 *
 */
export function exportFunctions(): Record<string, FirebaseFunction> {
  const filePaths = getMatchingFilepaths();
  const imports = getModules(filePaths);
  return getFirebaseFunctionsFromModules(imports);
}

function getMatchingFilepaths(): string[] {
  const pattern = `${process.cwd()}/**/*.function.{js,ts}`;
  return globSync(pattern);
}

function getModules(filePaths: string[]): Module[] {
  return filePaths.map((path) => ({
    name: getFunctionNameFromFile(path),
    module: require(path),
  }));
}

function getFunctionNameFromFile(filePath: string): string {
  return filePath.split("/").pop()?.split(".function")[0] as string;
}

function getFirebaseFunctionsFromModules(modules: Module[]): Record<string, FirebaseFunction> {
  const functions = modules.map((module) => getFirebaseFunctionsFromExports(module)).flat();
  const exports: Record<string, FirebaseFunction> = {};
  functions.forEach((fn) => {
    if (exports[fn.name]) {
      throw new Error(`Firebase Functions must have unique names. Please rename ${fn.name}.`);
    }
    exports[fn.name] = fn.fn;
  });
  return exports;
}

function getFirebaseFunctionsFromExports(imported: Module): ExportedFirebaseFunction[] {
  const exported = imported.module;
  const exports = Object.keys(imported.module);
  return exports
    .filter((key) => isFirebaseFunction(exported[key]))
    .map((key) => ({
      name: key === "default" ? imported.name : key,
      fn: exported[key],
    }));
}

function isFirebaseFunction(exported: unknown): exported is FirebaseFunction {
  return (
    typeof exported === "function" && (exported.name === "cloudFunction" || exported.name === "")
  );
}
