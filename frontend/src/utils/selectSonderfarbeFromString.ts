export function selectSonderfarbeFromString(
    sonderfarbenAsCommaSepString: string
): string {

    const screeningSonderfarbeList = sonderfarbenAsCommaSepString.split(",");
    const length = screeningSonderfarbeList.length;
    if (length > 0) {
        const randomIndex = Math.floor(Math.random() * length);
        return screeningSonderfarbeList[randomIndex].trim();
    }
    return "pupille-glow"

}