/**
 * RUT output format constants.
 * Use these constants instead of string literals for type safety.
 *
 * @internal These constants are for internal use only.
 */
export const RUT_FORMAT = {
  /**
   * Clean format: No dots, no dash (e.g., "123456789")
   * Use for: Internal processing, comparisons
   */
  CLEAN: 'clean',
  /**
   * Formatted format: With dots and dash (e.g., "12.345.678-9")
   * Use for: UI display, reports
   */
  FORMATTED: 'formatted',
} as const;
