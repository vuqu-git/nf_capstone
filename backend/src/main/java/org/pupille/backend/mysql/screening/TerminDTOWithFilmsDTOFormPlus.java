package org.pupille.backend.mysql.screening;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.pupille.backend.mysql.termin.TerminDTOScreeningdetails;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TerminDTOWithFilmsDTOFormPlus {
    private TerminDTOScreeningdetails termin;
    private List<FilmDTOFormPlus> mainfilms; // vorfilm=false/null
    private List<FilmDTOFormPlus> vorfilms;   // vorfilm=true
    private Integer terminGesamtlaufzeit;
}
