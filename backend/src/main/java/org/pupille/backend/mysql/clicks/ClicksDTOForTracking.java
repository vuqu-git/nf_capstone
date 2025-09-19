package org.pupille.backend.mysql.clicks;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ClicksDTOForTracking {
    private Long tnr;
    private LocalDateTime vorstellungsbeginn;
    private String titel;
    private Boolean wasSessionTerminClicked;
    private Boolean wasUserTerminClicked;
    private Boolean wasSessionCalendarClicked;
    private Boolean wasUserCalendarClicked;
}