const renderHtmlText = (
    htmlString: string | null | undefined,
    className?: string
) => {
    if (htmlString == null) {
        return undefined; // Or perhaps an empty div: <div />; or some other fallback
    }
    return <span className={className} dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export { renderHtmlText }; // Export the function with the desired name
