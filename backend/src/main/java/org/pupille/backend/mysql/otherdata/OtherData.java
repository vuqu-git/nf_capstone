package org.pupille.backend.mysql.otherdata;

import jakarta.persistence.Column;
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
    @Column(name = "`key`") // Escape the reserved keyword
    private String key;
    private String value;
    private String description;
}
