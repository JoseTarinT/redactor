## To run the code
- configure the job in `jobconfig.json` file:
    - `job`: job root folder (not used)
    - `baseDataPath`: data folder
    - `file`: input csv file
    - `separator_input`: csv separator of the input csv file
    - `separator_output`: csv separator of output csv file
    - `redact_on_cols`: list of columns to be redacted
- from the project root directory `coai-transcript-cli`, run 
`yarn ts-node redact-from-csv/index.ts`
