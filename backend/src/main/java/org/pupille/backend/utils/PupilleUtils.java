package org.pupille.backend.utils;

//Should It Be a @Service?
//    @Service classes are managed by Spring as beans and can be injected by Spring’s dependency injection.
//    Spring Services are most useful when the class needs dependencies (e.g., repositories, other services) or should participate in Spring’s dependency injection.
//    If the class contains only static, pure helper methods with no dependencies, it does not need to be a service.

// Here: This class is a pure utility class—it has no state and no dependencies. You should:
//    Declare the class as a regular Java class (no annotation).
//    Make the method(s) public static for easy use from anywhere.
//    Optionally, declare the class as final and make its constructor private to prevent instantiation (a common pattern for utility classes).

import java.time.LocalDate;

// No @Service annotation
public final class PupilleUtils {

    // Prevent instantiation by making it private
    private PupilleUtils() {}

    public static String extractDirectors(String stab) {
        if (stab == null || stab.isEmpty()) return "";

        // Normalize line endings
        String[] lines = stab.replace("\r\n", "\n").replace('\r', '\n').split("\n");

        // List of possible director field prefixes (add more as needed)
        String[] directorPrefixes = {
                "Regie:", "R:", "R, B&S:", "B,R&amp;S:", "R&S:", "R&amp;S:", "B&R:", "B&amp;R:", "B,R&S:","B,R&amp;S:", "B,R&K:", "B,R&amp;K:", "B,R:", "Buch & Regie:", "Buch &amp; Regie:", "Buch und Regie:",
                "Buch, Regie & Produktion:", "Buch, Regie &amp; Produktion:", "B&R&S:" , "B&amp;R&amp;S:", "B&R&K:" , "B&amp;R&amp;K:", "B&R&K&S:" , "B&amp;R&amp;K&amp;S:", "B,R&K&S:", "B,R&amp;K&amp;S:", "B,R&K:" , "B,R&amp;K:", "B,R:", "B&R:", "B&amp;R:", "Buch, Regie:"
        };

        for (String line : lines) {
            String trimmed = line.trim();
            for (String prefix : directorPrefixes) {
                if (trimmed.startsWith(prefix)) {
                    // Extract after prefix and trim
                    return trimmed.substring(prefix.length()).trim();
                }
            }
        }

        // Fallback: try to match "R:" at the start of any line
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("R:")) {
                return trimmed.substring(2).trim();
            }
        }

        // Fallback: try to match "Regie:" at the start of any line
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("Regie:")) {
                return trimmed.substring(6).trim();
            }
        }

        // If nothing found, return null
        return null;
    }

    public static String formatSemesterFromLocalDateTermin(LocalDate vorstellungsbeginn){
        int year = vorstellungsbeginn.getYear();
        int month = vorstellungsbeginn.getMonthValue();

        if (month < 4) {
            // January–March: preceding winter semester
            return String.format("Wintersemester %d/%d", year - 1, year);
        } else if (month < 10) {
            // April–September: current year's summer semester
            return String.format("Sommersemester %d", year);
        } else {
            // October–December: current winter semester (year/year+1)
            return String.format("Wintersemester %d/%d", year, year + 1);
        }
    }
}
