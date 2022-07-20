export default interface TestSession {
    _state: { [key: string]: any }; // the current state of key-values
    _history: Array<{ key: string, value: any, ts: number }>; // the history of overridden key-values

    constructor(history?: Array<{ key: string, value: any, ts: number }>): TestSession;

    set(key: string, value?: any): TestSession; // can set or remove a key from the state
    get(key: string): any | null;
    has(key: string): boolean;
}

// NOTE draft of requirements
// - parameters:        The necessary parameters for organizing and testing,
//                      e.g. applicant, connector, certs, routes.
//                      Should only be used as setup and not changed after starting the session.
// - identification:    -> parameters
// - statements:        During testing any validation results can be saved as statement
//                      about the tested component. Can also be used for claims.
// - claims:            -> statements
// - cache:             -> statements
// - result:            Must be generated out of the statements, maybe after the session has finished.
//                      A result can be decoupled from the test session if it is used in a verifiable presentation
//                      and a test session that is packed as a verifiable credential.
// - history:           The history is important if a statement changes during one
//                      testing session, especially if it is a continued testing session.
// - logs:              Logs can give more information about the flow of validation and testing
//                      and might help resolve issues.
// - errors:            -> logs
// - timestamps:        Timestamps are important for each statement, log and the history.
//                      They can also be used to denote the start and end of a test session.
// - persistence:       The session file must be saved as json with a context or as ld-format, e.g. turtle.
//                      Optionally multiple file formats might be supported.
// - serialization:     -> persistence
// - presentation:      Generating a verifiable credential might not be the task of the session class,
//                      because it requires certificates for the proof which are not useful otherwise for the session.
//                      Also the usage of a verifiable credential as serialization format would not be practical.
//                      It can easily be archived though by using normalized json-ld as credential subject.
