import { generateKeyboardWithActions } from '@utils'
import { NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/types'
import { IContext } from '@types'

export default async function stickerHandler(context: NarrowedContext<IContext, Update>) {
    if (!('sticker' in context.message!)) return

    const sticker = context.message.sticker
    if (sticker.is_animated) return await context.reply('[ERROR] Animated stickers are not supported!')

    const url = await context.telegram.getFileLink(sticker.file_id)
    const requests = context.session.requests.get(context.message.from.id)

    if (requests)
        requests.push({
            fileId: sticker.file_id,
            fileUniqueId: sticker.file_unique_id,
            url: url.toString(),
        })
    else
        context.session.requests.set(context.message.from.id, [
            {
                fileId: sticker.file_id,
                fileUniqueId: sticker.file_unique_id,
                url: url.toString(),
            },
        ])

    await context.deleteMessage(context.message.message_id)

    return await context.replyWithSticker(sticker.file_id, {
        reply_markup: await generateKeyboardWithActions(context.message.from.id.toString(), sticker.file_unique_id),
    })
}
