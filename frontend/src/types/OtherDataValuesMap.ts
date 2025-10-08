// corresponds to return type of backend controller method (in OtherDateController)
// @GetMapping("/api/otherdata/get-values")
// public Map<String, String> getValues(@RequestParam
//        -------------------

export type OtherDataValuesMap = {
    [key: string]: string;
};