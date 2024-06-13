import parse from 'csv-parse/lib/sync'
import fs from 'promise-fs'
import getRedactedString from './redact'
import csvStringify from 'csv-stringify'

/**
 * This tool will redact PII from every cell (every row + column) in a given csv file
 */

import jobConfig from './jobconfig.json'


(async function () {
  try {
    const content = await fs.readFile(`${__dirname}/${jobConfig.baseDataPath}/${jobConfig.file}`)

    const records = parse(content, { delimiter: jobConfig.separator_input, trim: true }) as string[][]

    const redactedRecords = records.map(async (row_data: any) => {
      for (const col of jobConfig.redact_on_cols) {
        const redactedStr = getRedactedString(row_data[col])
        row_data[col] = await redactedStr
      }
      // return r.map(col_data => regexRedactor.redact(col_data));
      return await row_data
    })

    const redactedRecordsPromises = await Promise.all(redactedRecords);

    csvStringify(redactedRecordsPromises, { delimiter: jobConfig.separator_output }, function (err, output) {
      if (err) throw err
      fs.writeFile(`${__dirname}/${jobConfig.baseDataPath}/output_${jobConfig.file}`, output)
    })
  } catch (e) {
    console.error(e)
  }
})()
