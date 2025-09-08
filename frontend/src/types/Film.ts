export type Film = {
    fnr?: number, // Primary key, auto-generated, so it might not be present when creating a new Film
    titel?: string,
    originaltitel?: string | null,
    originaltitelAnzeigen?: boolean | null,
    text?: string | null,
    kurztext?: string | null,
    besonderheit?: string | null,
    land?: string | null,
    jahr?: number | null,
    farbe?: string | null,
    laufzeit?: number | null,
    sprache?: string | null,
    untertitel?: string | null,
    format?: string | null,
    fsk?: '_0' | '_6' | '_12' | '_16' | '_18' | 'UNGEPRUEFT' | null, // Or just optional
    stab?: string | null,
    bild?: string | null,
    offsetImageInGallery?: string;
    sonderfarbeTitel?: number | null,
    sonderfarbe?: string | null,
    regie?: string,
    contentNote?: string,
    trailer?:string,
    verleih?:string,
}

// Explanation of Nullability in TypeScript:
//      ? (Optional Property):
//          If a property in your Spring Boot entity allows a NULL value and is not a primitive type in Java (like Integer, String, Boolean),
//          the corresponding property in your TypeScript interface should be marked as optional using the ? after the property name.
//          This signifies that the property might not always be present in the data you receive from the backend.
//
//      | null (Nullable Type):
//          For properties that can explicitly be null (even if they are present in the response),
//          you can use the union type | null. This makes it explicit that the value can be either the specified type or null.


// Optional Properties (?):
//      When you use the ? to make a property optional in TypeScript (e.g., fnr?: number),
//      it essentially means that the property can either be of the specified type (number in this case) or undefined.
//      The undefined value signifies that the property might not be present in the JavaScript object at all.
//      This is common when dealing with data fetched from an API where certain fields might be omitted depending on the request or the state of the resource.