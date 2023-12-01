import { convertImage } from '@utils'
import { Context } from 'telegraf'
import { cache } from '@constants'

export default async function actionHandler(context: Context) {
    if ('match' in context && Array.isArray(context.match)) {
        const [, messageId, format] = context.match

        const fileId = cache.get(messageId)
        if (!fileId) return await context.reply('[ERROR] Image not found...')

        const url = await context.telegram.getFileLink(fileId)
        const convertedImageBuffer = await convertImage(url.toString(), format)

        await context.answerCbQuery()

        return await context.replyWithDocument(
            {
                source: convertedImageBuffer,
                filename: `converted.${format}`,
            },
            {
                caption: 'Thanks for waiting.',
            }
        )
    }
}
