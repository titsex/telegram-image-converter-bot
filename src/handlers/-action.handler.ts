import { convertImage, extendContext, generateKeyboardWithActions, generateKeyboardWithImageFormats } from '@utils'
import { ActionMatchType, IContext, ImageFormatType } from '@types'

export default async function actionHandler(context: IContext) {
    extendContext(context)

    if (!('match' in context)) return
    if (!Array.isArray(context.match)) return
    if (!('callback_query' in context.update)) return

    const [type, userId, fileId, payload] = context.match[0].split('~') as ActionMatchType
    await context.answerCbQuery()

    const requests = context.session.requests.get(context.update.callback_query.from.id)

    const request = requests?.find((file) => file.fileUniqueId === fileId)
    if (!request) return await context.reply('Image not found...')

    await context.deleteMessage(context.update.callback_query.message!.message_id)

    if (!payload) {
        request.type = type

        switch (type) {
            case 'convert':
                return await context.reply('Select the format to convert:', {
                    reply_markup: await generateKeyboardWithImageFormats(userId, request.fileUniqueId),
                })
            case 'resize':
                return await context.reply('Send me a new size. For example, 640x400.')
            default:
                return await context.reply('Select an action.', {
                    reply_markup: await generateKeyboardWithActions(userId, request.fileUniqueId),
                })
        }
    }

    switch (type) {
        case 'convert':
            context.session.requests.set(
                context.update.callback_query.from.id,
                requests?.filter((file) => file.fileUniqueId !== request.fileUniqueId) || []
            )

            return await context.replyWithDocument(
                {
                    source: await convertImage(request.url, payload as ImageFormatType),
                    filename: `converted.${payload}`,
                },
                {
                    caption: 'Thanks for waiting.',
                }
            )
    }
}
