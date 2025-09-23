package org.pupille.backend.mysql.otherdata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class OtherDataController {

    @Autowired
    private OtherDataService service;

    @GetMapping("/api/otherdata/get-values")
    public Map<String, String> getValues(@RequestParam Map<String, String> allRequestParams) {
        Map<String, String> result = new HashMap<>();
        for (String key : allRequestParams.keySet()) {
            String value = service.findValueByKey(key);
            result.put(key, value != null ? value : "[Not found]");
        }
        return result;
    }
}
