package org.pupille.backend.mysql.otherdata;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "other_data")
@Data
@NoArgsConstructor
public class OtherData {
    @Id
    private String dataKey;
    private String dataValue;
    private String description;
}
