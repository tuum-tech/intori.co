import { NextApiRequest } from 'next'
import formidable from 'formidable'
import { parse } from 'csv-parse/sync'
import fs from 'fs'

export const getCsvFromRequest = async (
  req: NextApiRequest
): Promise<Array<unknown>> => {
    // Parse the form data
    const form = formidable()
    const uploadedResult = await form.parse(req)
    const files = uploadedResult[1]

    if (!files.csv) {
      throw new Error('CSV file is required')
    }

    const csvFile = files.csv[0]
    if (!csvFile.mimetype?.includes('csv')) {
      throw new Error('File must be a CSV')
    }

    // Read and parse the CSV file
    const csvContent = fs.readFileSync(csvFile.filepath, 'utf-8')
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    })

    fs.unlinkSync(csvFile.filepath)

    return records
}
