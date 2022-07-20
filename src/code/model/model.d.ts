// NOTE draft of requirements
// - parameters:        The necessary parameters for organizing and testing,
//                      e.g. applicant, connector, certs, routes.
//                      Should only be used as setup and not changed after starting the session.
// - identification:    -> parameters
// - properties:        Any additional properties that are managed by the test session
//                      and not intended to be changed by any test.
// - statements:        During testing any validation results can be saved as statement
//                      about the tested component. Can also be used for claims.
// - claims:            -> statements
// - cache:             -> statements, properties
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

import {KeyObject} from 'crypto'
import {FileHandle} from 'fs/promises'

type timestamp = string
type native = boolean | number | string

declare interface ParameterObject {
    key: string
    value: native
}

export class Parameter {
    readonly key: string
    readonly value: native

    constructor(parameter: ParameterObject)
    toJSON(): ParameterObject
}

declare interface StatementObject {
    created: timestamp
    removed?: timestamp

    identifier: string
    // TODO
    contentType: string
    content: string
}

export class Statement {
    constructor(statement: StatementObject)
    toJSON(): StatementObject
    // TODO
}

declare interface LogEntryObject {
    created: timestamp
    message: string
    type: string
}

export class LogEntry {
    readonly created: timestamp
    readonly message: string
    readonly type: string

    constructor(logEntry: string | Error | LogEntryObject)
    toJSON(): LogEntryObject
}

type TestSessionContext = 'https://www.nicos-rd.com/fua/gbx/ts/model/TestSessionContext' | {
    tsm: 'https://www.nicos-rd.com/fua/gbx/ts/model#',
    parameters: {
        '@id': 'tsm:parameter',
        '@container': '@id',
        '@type': 'tsm:Parameter'
    }
    // TODO
}

declare interface TestSessionObject {
    '@context': TestSessionContext
    parameters: { [key: string]: native }
    statements: Array<StatementObject>
    history: Array<StatementObject>
    logs: Array<LogEntryObject>
    [property: string]: unknown
}

export class TestSession {
    private filename: string
    private file: FileHandle | null

    private properties: { [key: string]: native }
    private parameters: { [key: string]: Parameter }
    private statements: { [key: string]: Statement }
    private history: { [key: string]: Array<Statement> }
    private logs: Array<LogEntry>

    constructor(filename: string)

    load(): Promise<void>
    save(): Promise<void>
    close(): Promise<void>

    parameter(key: string): string | number | boolean | null
    statement(key: string, value: undefined | null | any): any | null
    log(entry: string | Error): void

    toJSON(): TestSessionObject
    toTTL(): string
    toVC(signKey: string | Buffer | KeyObject): string
}

export default TestSession
