const renderHtmlContent = (
    htmlString: string | null | undefined,
    className?: string
) => {
    if (htmlString == null) {
        return undefined;
    }
    return <div className={className} dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export { renderHtmlContent };
