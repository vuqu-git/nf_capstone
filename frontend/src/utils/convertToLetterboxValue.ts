export function convertToLetterboxValue(letterboxHeight: string | number): string {
    // Format the letterbox height value for IdentSlides
    // letterboxHeight could be 20%, 20vh or 300 (i.e. 300px)

    return typeof letterboxHeight === 'number'
        ? `${letterboxHeight}px`
        : letterboxHeight;
}