/**
 * The config for the Firebase Function Exporter
 */
interface ExporterConfig {
  /**
   * A glob pattern for the name of files with Firebase Functions.
   */
  fileNamePattern?: string;
  /**
   * An array of subdirectories to search for Firebase Functions.
   * Use ['*'] to search for all.
   */
  directories?: string[];
}

/**
 * Exports all JS/TS Firebase Functions in all subdirectories
 * matching the filename '{functionName}.function.{ts,js}'.
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
export function exportFunctions(): Record<string, Function>;
/**
 * Exports all Firebase Functions according to the provided config
 * and defaults.
 * @param config the config
 * @default
 * {
 *    directories: ['*'],
 *    fileNamePattern: '*.functions.{ts,js}'
 * }
 * @example
 *  // In all subdirectories:
 *  exportFunctions({
 *    fileNamePattern: '*.func.{ts,js}',
 *    directories: ['*']
 *  });
 *
 *  // In selected subdirectories:
 *  exportFunctions({
 *    fileNamePattern: '*.function.{ts,js}',
 *    directories: ['reactive', 'callable']
 *  })
 */
export function exportFunctions(
  config: ExporterConfig
): Record<string, Function>;
export function exportFunctions(
  config?: ExporterConfig
): Record<string, Function> {}
