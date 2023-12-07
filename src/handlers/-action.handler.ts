import responseHandler from '@handler/actions/-response.handler'

import {
    convertImage,
    extendContext,
    generateKeyboardWithImageFormats,
    generateKeyboardWithResizeFitFormats,
} from '@utils'

import { ActionMatchType, IContext, ImageFormatType } from '@types'
import { Document, Message } from 'telegraf/types'

export default async function actionHandler(context: IContext) {
    extendContext(context)

    if (!('match' in context)) return
    if (!Array.isArray(context.match)) return
    if (!('callback_query' in context.update)) return

    const [type, userId, fileId, payload] = context.match[0].split('~') as ActionMatchType
    await context.answerCbQuery()

    const requests = context.session.requests.get(context.update.callback_query.from.id)

    const request = requests?.find((file) => file.fileUniqueId === fileId)
    if (!request) return await context.reply('The action has expired!')

    if (!payload) {
        request.type = type

        switch (type) {
            case 'convert':
                return await context.editMessageReplyMarkup(
                    generateKeyboardWithImageFormats(userId, request.fileUniqueId)
                )
            case 'resize':
                return await context.editMessageReplyMarkup(
                    generateKeyboardWithResizeFitFormats(userId, request.fileUniqueId)
                )
        }
    }

    let message = {} as Message

    request.payload = payload

    switch (type) {
        case 'convert':
            delete request.type

            message = await context.replyWithDocument({
                source: await convertImage(request.url, payload as ImageFormatType),
                filename: `converted.${payload}`,
            })

            if (payload === 'webp' && 'sticker' in message) message.document = message.sticker as Document

            break
        case 'resize':
            return await context.reply('Send me a new size. For example, 640x400!')
    }

    return await responseHandler(context, message, request)
}
