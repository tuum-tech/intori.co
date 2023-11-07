import { UploadedDataDetail } from '@/components/upload/UploadedTypes'
import { normalizeOrderData } from '@/utils/credNormalizer'
import { File, IncomingForm } from 'formidable'
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import Papa from 'papaparse'

type Order = {
  [key: string]: string
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function uploadFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new IncomingForm()

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: 'Form parsing error', err })
    }

    // Handle the possibility of 'files.file' being an array
    const fileArray = files.file instanceof Array ? files.file : [files.file]
    const file = fileArray[0] as File

    // If there is no file, return an error
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: 'No file was uploaded.' })
    }

    fs.readFile(file.filepath, 'utf8', (readErr, data) => {
      if (readErr) {
        return res
          .status(500)
          .json({ success: false, message: 'File reading error', readErr })
      }

      Papa.parse(data, {
        complete: async (results) => {
          console.log('Numer of items in file:', results.data.length)
          if (results.errors.length) {
            console.error('Errors while parsing:', results.errors)
            // Filter out rows with missing fields
            results.data = results.data.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (row: any) => !row.hasOwnProperty('__parsed_extra')
            )
          }

          // Directly use the parsed data without remapping
          const parsedData = results.data.slice(0) as Order[]
          if (parsedData.length === 0 || !parsedData[0]['Order ID']) {
            return res.status(400).json({
              success: false,
              message: 'Invalid file format or no valid items found.',
              errors: results.errors
            })
          }

          try {
            const uploadedDataDetailsPromises =
              results.data.map(normalizeOrderData)
            const uploadedDataDetails: UploadedDataDetail[] = await Promise.all(
              uploadedDataDetailsPromises
            )

            // Send back the parsed data
            res.status(200).json({ success: true, data: uploadedDataDetails })
          } catch (error) {
            res.status(400).json({
              success: false,
              message: 'Error processing uploaded data.',
              error
            })
          }
        },
        header: true,
        skipEmptyLines: true
      })
    })
  })
}
