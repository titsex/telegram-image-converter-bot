import { generateKeyboardWithActions } from '@utils'
import { IContext, ImageFormatType } from '@types'
import { NarrowedContext } from 'telegraf'
import { imageFormats } from '@constants'
import { Update } from 'telegraf/types'

export default async function documentHandler(context: NarrowedContext<IContext, Update>) {
    if (!('document' in context.message!)) return

    const document = context.message.document

    if (!imageFormats.includes(document.mime_type!.split('/')[1] as ImageFormatType))
        return context.reply('[ERROR] The document extension must be an image!')

    const url = await context.telegram.getFileLink(document.file_id)
    const requests = context.session.requests.get(context.message.from.id)

    if (requests)
        requests.push({
            fileId: document.file_id,
            fileUniqueId: document.file_unique_id,
            url: url.toString(),
        })
    else
        context.session.requests.set(context.message.from.id, [
            {
                fileId: document.file_id,
                fileUniqueId: document.file_unique_id,
                url: url.toString(),
            },
        ])

    await context.deleteMessage(context.message.message_id)

    return await context.replyWithDocument(document.file_id, {
        reply_markup: await generateKeyboardWithActions(context.message.from.id.toString(), document.file_unique_id),
    })
}
