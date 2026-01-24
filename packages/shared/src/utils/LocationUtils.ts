export const LocationUtils = {
    /**
     * Parse a stored location string into country and postal code.
     * Supports legacy format (just zip) and new format (country:zip).
     */
    parse(storedValue: string): { country: string; code: string } {
        if (!storedValue) {
            return { country: 'us', code: '' };
        }
        // Check for "CC:Code" format
        if (storedValue.includes(':')) {
            const [country, code] = storedValue.split(':');
            return { country: country.toLowerCase(), code };
        }
        // Fallback for legacy US zip codes
        return { country: 'us', code: storedValue };
    },

    /**
     * Format country and code into storage string.
     */
    format(country: string, code: string): string {
        if (!country) return code;
        return `${country.toLowerCase()}:${code}`;
    }
};
