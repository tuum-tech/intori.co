import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { createObjectCsvStringifier } from 'csv-writer'
import { getAllUserResponses } from '../../../models/userAnswers'
import { isSuperAdmin } from '../../../utils/isSuperAdmin'

const downloadCsvOfStats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req })

    if (!session?.user?.fid) {
      return res.status(401).end()
    }

    const fid = parseInt(session.user.fid, 10)

    if (!isSuperAdmin(fid)) {
      return res.status(404).end()
    }

    const documents = await getAllUserResponses()

    // Define the CSV header and fields
    const header = Object.keys(documents[0]).map(key => ({ id: key, title: key }))
    const csvStringifier = createObjectCsvStringifier({
      header,
    })

    // Generate the CSV string
    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(documents)

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment filename=intori-stats.csv')
    res.status(200).send(csv)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export default downloadCsvOfStats
