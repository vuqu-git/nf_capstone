export type ProgrammheftDTOWithSemesterField = {
    pnr: number | undefined,
    titel: string,
    bild?: string,
    pdf: string,
    gueltigVon: string,
    gueltigBis: string,
    semester: string,
}