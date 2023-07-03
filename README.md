# nrd-testsuite

## Setup

The configuration of the testsuite can be done with process arguments or environmental variables.
Their values will override the default values of the configuration file with priority by the process args:

- **id**: the id of the testsuite, will be generated randomly at runtime by the testing module if not specified
- **connect**
    - **type**: the type of connection to the testbed, defaults to "http"
    - **url**: the testbed testing url for the http connection
    - **headers**
        - **Authorization**: the authorization header with a Basic-Auth string, defaults to "testsuite:testsuite"
    - **agent**: the node https agent, defaults to a secure agent which rejects unknown certificates
- **session**
    - **file**: the file path to the session file, defaults to the session inside the default folder
    - **properties**
        - **date**: the current date
        - **operator**: the current operator, defaults to "default"

### Process ARGS

- **id**: testsuite id
- **url**: testing url to the testbed
- **username**: username for the Basic-Auth header
- **password**: password for the Basic-Auth header
- **insecure**: enables unvalidated https certs
- **session**: folder to the session file relative from the data folder
- **operator**: operator property for the test session

### ENV Variables

- **TESTSUITE_ID**: testsuite id
- **TESTING_URL**: testing url to the testbed
- **TESTSUITE_USERNAME**: username for the Basic-Auth header
- **TESTSUITE_PASSWORD**: password for the Basic-Auth header
- **TESTING_INSECURE**: enables unvalidated https certs
- **TEST_SESSION**: folder to the session file relative from the data folder
- **TESTING_OPERATOR**: operator property for the test session

## Usage

The testsuite agent is automatically included in all tests in this repository by the _package.json_ via `mocha.require`.
It is accessible in any test method by means of the _this_ context:

```js
test('ping', async function () {
    const token = await this.ts.test({
        ecosystem:  'urn:tb:ec:net',
        testMethod: 'urn:tb:ec:net:tm:ping',
        param:      {
            host: this.ts.prop('host')
        }
    });
});
```

Currently, the testsuite has two methods:

- **test**: calls a test in the testbed and return a token promise
- **prop**: extracts a property from the current session

Additional to the testsuite agent the _this_ context of the test also has an _expect_ method.
This is the same method as requiring _expect_, but it has custom matchers to simplify validation methods. 
