/**
 * Sanitizes a string for use as a SQL table identifier.
 * Replaces spaces and other invalid characters with underscores.
 * 
 * @param name - The name to sanitize
 * @returns A sanitized string safe for use as a SQL table identifier
 */
export function sanitizeForSQL(name: string): string {
    if (!name) return '';
    
    // Replace spaces and other problematic characters with underscores
    // Keep only alphanumeric characters and underscores
    return name
        .trim()
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .replace(/_{2,}/g, '_') // Replace multiple consecutive underscores with single underscore
        .replace(/^_+|_+$/g, ''); // Remove leading and trailing underscores
}

/**
 * Creates a sanitized table name for substance intakes
 * 
 * @param substanceName - The substance name
 * @returns A sanitized table name in the format "{sanitized_name}_intakes"
 */
export function getIntakesTableName(substanceName: string): string {
    return `${sanitizeForSQL(substanceName)}_intakes`;
}
