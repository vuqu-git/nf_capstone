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
                                                     //Map here: collects all query parameters from the request URL into a single Map when using @RequestParam without specifying a parameter name
                                                     //        → allows endpoint to handle a variable, unknown number of query parameters dynamically without defining each one explicitly
                                                     //        → i.e. when Spring encounters @RequestParam Map<String, String>, it doesn't look for a specific parameter name—instead, it captures ALL query parameters and their values together as key-value pairs in the Map
                                                     //        → GET /api/otherdata/get-values?key1=value1&key2=value2&key3=value3
                                                     //        → Spring automatically populates allRequestParams with:
                                                    //        {
                                                    //            "key1": "value1",
                                                    //                "key2": "value2",
                                                    //                "key3": "value3"
                                                    //        }

        // my usage: GET /api/otherdata/get-values?hessischerKinopreis=&kinematheksKinopreis=
        // i.e. URL only passes keys without values (empty values after the = signs), and that's perfectly valid for this use case
        // Spring creates a Map with:
        // {
        //  "hessischerKinopreis": "",
        //  "kinematheksKinopreis": ""
        // }
        // The keys are what matter to my application → the values in the query parameters are empty strings (which the code below ignores)

        // Cleaner alternative
        // ~~~~~~~~~~~~~~~~~~~
        //        Option 1: List of keys

        //        @GetMapping("/api/otherdata/get-values")
        //        public Map<String, String> getValues(@RequestParam List<String> keys) {
        //            // Call: ?keys=hessischerKinopreis&keys=kinematheksKinopreis
        //            // iterating over keys
        //        }
        //
        //        Option 2: Comma-separated
        //
        //        @GetMapping("/api/otherdata/get-values")
        //        public Map<String, String> getValues(@RequestParam String keys) {
        //            String[] keyArray = keys.split(",");
        //            // Call: ?keys=hessischerKinopreis,kinematheksKinopreis
        //            // iterating over keyArray
        //        }


        Map<String, String> result = new HashMap<>();
        // design is ideal when the caller determines which keys to query at runtime.
        // The controller doesn't need to know in advance which specific dataKey values will be requested
        // it simply iterates through whatever keys the client provides, looks up each one in the database via OtherDataService, and returns the corresponding dataValue or "[Not found]" for missing entries
        // alternative, if only specific, known parameters were needed, the controller could use individual @RequestParam annotations: @RequestParam String key1, @RequestParam String key2
        for (String key : allRequestParams.keySet()) {
            String value = service.findValueByKey(key);
            result.put(key, value != null ? value : "[Not found]");
        }
        return result;
    }
}
