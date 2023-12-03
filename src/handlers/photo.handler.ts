import { generateKeyboardWithActions } from '@utils'
import { NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/types'
import { IContext } from '@types'

export default async function photoHandler(context: NarrowedContext<IContext, Update>) {
    if (!('photo' in context.message!)) return

    const betterPhoto = context.message.photo.sort((a, b) => b.file_size! - a.file_size!)[0]
    const url = await context.telegram.getFileLink(betterPhoto.file_id)
    const requests = context.session.requests.get(context.message.from.id)

    if (requests)
        requests.push({
            fileId: betterPhoto.file_id,
            fileUniqueId: betterPhoto.file_unique_id,
            url: url.toString(),
        })
    else
        context.session.requests.set(context.message.from.id, [
            {
                fileId: betterPhoto.file_id,
                fileUniqueId: betterPhoto.file_unique_id,
                url: url.toString(),
            },
        ])

    await context.deleteMessage(context.message.message_id)

    return await context.replyWithPhoto(betterPhoto.file_id, {
        reply_markup: await generateKeyboardWithActions(context.message.from.id.toString(), betterPhoto.file_unique_id),
    })
}
