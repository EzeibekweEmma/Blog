import { Request, Response } from 'express'

export function getServerStatusService(req: Request, res: Response) {
  try {
    const uptimeSeconds = Math.floor(process.uptime())

    // Convert uptime to days, hours, minutes, and seconds
    const days = Math.floor(uptimeSeconds / (60 * 60 * 24))
    const hours = Math.floor((uptimeSeconds % (60 * 60 * 24)) / (60 * 60))
    const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60)
    const seconds = uptimeSeconds % 60

    const uptimeString = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`

    res.status(200).json({
      data: { message: `Server is up and running - ${uptimeString}` },
    })
  } catch (error) {
    res.status(500).json({
      data: { message: (error as Error).message },
    })
  }
}
