import { type Request, type Response } from 'express'
import { Message } from '../constant/messages'
import { StatusCodes } from '../constant/statusCodes'
import Error from '../utils/HttpException.utils'

class MediaController {
  async create(req: Request, res: Response) {
    if (req?.files?.length === 0) throw Error.badRequest('Sorry file could not be Uploaded')
    const data = req?.files?.map((file: any) => {
      return {
        name: file?.filename,
        mimeType: file?.mimeType,
        type: req.body?.type,
      }
    })
    res.status(StatusCodes.CREATED).json({
      status: true,
      message: Message.created,
      data,
    })
  }
}
export default new MediaController()
