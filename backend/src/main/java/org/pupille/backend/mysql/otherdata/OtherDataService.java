package org.pupille.backend.mysql.otherdata;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OtherDataService {

    private final OtherDataRepository otherDataRepo;

    public String findValueByKey(String key) {
        Optional<OtherData> data = otherDataRepo.findById(key);
        return data.map(OtherData::getValue).orElse(null);
    }
}
