declare interface CriterionObject {
    '@id': string; // only the id is mandatory, the rest is not defined
    [other: string]: unknown;

    // The following properties come from the example file,
    // but they are not used by the implementation:
    timestamp: string;
    prov: {
        testFunction: string,
        validationFunction: string
    };
    param: null;
    result: null;
    status: string,
    history: []
}

declare interface SessionObject {
    sessionStart: string; // time of the constructor or read from loaded session
    sessionEnd: string; // time of the session end method
    timestamp: string; // time of the last criterion update
    criteria: Array<CriterionObject>; // never updated be the session

    // The following properties come from the example file,
    // but they are not used by the implementation:
    '@context': string,
    applicant: string,
    additional: [],
    log: string
}

export default interface Session {
    _session_folder: string; // folder path for log file, session file and presentation file
    _log_file_path: string; // file path to the log file
    _session_file_path: string; // file path to the session serialization

    _applicant: string; // only set but not assigned to the session object
    _session: SessionObject; // json serialization of the session
    _criteria_map: Map<string, CriterionObject>; // a map with arbitrary criterion objects

    _loadFromFile(): void;
    _savetoFile(): void;

    constructor(param: { applicant: string, session_folder: string, log_file_name: string, session_file_name: string }): Session;

    log(message: string, ts?: string): void; // appends the message with a timestamp to the log file
    setCriterion(id: string, value: { status: string }): void; // changes the criteria map but does not change the criteria at the session object
    sessionEnd(): void; // sets the session end timestamp and saves the file
    presentVerifiableCredential(param: { file_name: string, presentationProof(obj: Object): string, credentialProof(obj: Object): string }): void;
}
