export default interface TestSession {
    _state: { [key: string]: any }; // the current state of key-values
    _history: Array<{ key: string, value: any, ts: number }>; // the history of overridden key-values

    constructor(history?: Array<{ key: string, value: any, ts: number }>): TestSession;

    set(key: string, value?: any): TestSession; // can set or remove a key from the state
    get(key: string): any | null;
    has(key: string): boolean;
}
