// utils/safeTruncate.ts
/**
 * Truncates text to max length without cutting a word.
 * If the string is shorter than maxLen, it returns the original string.
 * @param text The text to truncate.
 * @param maxLen The maximum allowed length (excluding "...").
 * @returns The truncated string with "..." appended if truncation occurred.
 */
export const safeTruncate = (text: string, maxLen: number): string => {
    if (!text || text.length <= maxLen) {
        // ensuring that text is valid before proceeding with the truncation logic is crucial for robust code
        // !text: checks if the text argument is either null, undefined, or an empty string.
        //      If any of these cases are true, it returns the original value of text because there's nothing to truncate.
        //      This effectively prevents the function from throwing an error due to trying to access properties (like length) on a non-string type.
        return text;
    }

    // Truncate to the max length
    let truncated = text.substring(0, maxLen);

    // Find the last space to avoid cutting a word
    const lastSpaceIndex = truncated.lastIndexOf(' ');  // searches the truncated string for the last occurrence of a space character
                                                                           // If there are no spaces in the string, it returns -1

    if (lastSpaceIndex !== -1 && lastSpaceIndex < maxLen) {
        // Truncate at the last whole word
        truncated = truncated.substring(0, lastSpaceIndex);
                                                // character at the position lastSpaceIndex is EXCLUDED in the resulting substring
    }

    // Check again to avoid truncating if the last "whole word truncation" made it too short
    if (truncated.length < text.length) {   // confirming that the string has indeed been truncated
        return truncated.trim() + '...';
    }

    return text; // Should not happen if text.length > maxLen, but a safeguard
};