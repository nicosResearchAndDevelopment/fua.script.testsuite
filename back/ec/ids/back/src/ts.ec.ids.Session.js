const
    path = require('path'),
    fs   = require('fs'),
    util = require('./ts.ec.ids.util.js');

// REM: wir halten die session.json so flach wie möglich, um es so performant wie möglich
//      auf die Festplatte zu bekommen (und nicht eine VP).

const
    initErr                                  = function () {
        this.timestamp = util.utcDateTime();
    },
    ErrorApplicantIsMissing                  = util.createErrorClass(
        'ErrorApplicantIsMissing', 'urn:gbx:ts:errors:applicant-is-missing', initErr
    ),
    ErrorApplicantSessionFolderPathIsMissing = util.creeateErrorClass(
        'ErrorApplicantSessionFolderPathIsMissing', 'urn:gbx:ts:errors:applicant-session-folder-path-is-missing', initErr
    ),
    ErrorApplicantSessionFolderIsMissing     = util.createErrorClass(
        'ErrorApplicantSessionFolderIsMissing', 'urn:gbx:ts:errors:applicant-session-folder-is-missing', initErr
    ),
    ErrorCriterionUnknown                    = util.createErrorClass(
        'ErrorCriterionUnknown', 'urn:gbx:ts:errors:criterion-unknown', initErr
    );

class Session {

    #applicant         = '';
    #session_folder    = '';
    #log_file_path     = '';
    #session_file_path = '';
    #session           = null;
    #criteria_map      = new Map();

    #savetoFile() {
        const fileContent = JSON.stringify(this.#session, null, '\t');
        fs.writeFileSync(this.#session_file_path, fileContent);
    }

    #loadFromFile() {
        const fileContent = fs.readFileSync(this.#session_file_path);
        this.#session     = JSON.parse(fileContent);
    }

    constructor(
        {
            'applicant':         applicant = undefined,
            'session_folder':    session_folder = undefined,
            'log_file_name':     log_file_name = 'log.txt',
            'session_file_name': session_file_name = 'session.json'
        }
    ) {
        if (!applicant) throw ErrorApplicantIsMissing(`applicant: <${applicant}>`);
        this.#applicant = applicant;

        if (!session_folder) throw ErrorApplicantSessionFolderPathIsMissing(`session folder path: <${session_folder}>`);
        this.#session_folder = session_folder;

        if (!fs.existsSync(this.#session_folder)) throw new ErrorApplicantSessionFolderIsMissing(`session folder: (path) <${this.#session_folder}>`);
        this.#log_file_path     = path.join(this.#session_folder, log_file_name);
        this.#session_file_path = path.join(this.#session_folder, session_file_name);

        this.#loadFromFile();

        const local_session_start  = this.#session.sessionStart || util.utcDateTime();
        this.#session.sessionStart = this.#session.sessionStart || local_session_start;
        this.#session.sessionEnd   = null;

        this.#savetoFile();

        if (this.#session.criteria) for (let criterion of this.#session.criteria) {
            this.#criteria_map.set(criterion['@id'], criterion);
        }

        this.log('session : start', local_session_start);
    } // Session#constructor

    log(message, ts) {
        const logContent = `${ts || util.utcDateTime()} : ${message}\n`;
        fs.appendFileSync(this.#log_file_path, logContent);
    } // Session#log

    setCriterion(id, value) {
        let
            criterion = this.#criteria_map.get(id),
            changed   = false;

        if (!criterion) throw new ErrorCriterionUnknown(`session : criterion <${id}> unknown`);

        if (value['status'] && (value['status'] !== 'undef')) {
            if ((criterion['status'] === 'undef') || (criterion['status'] === 'pass')) {
                criterion['status'] = value['status'];
                criterion.timestamp = util.utcDateTime();
                changed             = true;
            } // if ()
        } // if ()
        if (changed) {
            this.#session.timestamp = util.utcDateTime();
            this.#savetoFile();
        } // if ()
    } // Session#setCriterion

    sessionEnd() {
        this.#session.sessionEnd = util.utcDateTime();
        this.log('session : end', this.#session.sessionEnd);
        this.#savetoFile();
    } // Session#sessionEnd

    presentVerifiableCredential(
        {
            presentationProof = ({}) => {
                return 'TODO_EMPTY_presentationProof';
            },
            credentialProof = ({}) => {
                return 'TODO_EMPTY_credentialProof';
            },
            file_name = 'verifiablePresentation.json'
        }
    ) {
        let
            vp        = {},
            file_path = path.join(this.#session_folder, file_name);

        vp['proof'] = presentationProof({});
        this.log(`presentation : VerifiablePresentation : <${file_path}>`);
        fs.writeFileSync(file_path, `${JSON.stringify(vp, null, '\t')}`);
    } // Session#presentVerifiableCredential

} // Session

module.exports = Session;
