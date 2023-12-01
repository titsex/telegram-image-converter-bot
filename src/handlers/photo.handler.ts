import { generateKeyboardWithImageFormats } from '@utils'
import { Context, NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/types'
import { cache } from '@constants'

export default async function photoHandler(context: NarrowedContext<Context, Update>) {
    if ('photo' in context.message!) {
        const betterPhoto = context.message.photo.sort((a, b) => b.file_size! - a.file_size!)[0]

        cache.set(context.message.message_id.toString(), betterPhoto.file_id)

        return await context.reply('Select the format to convert:', {
            reply_markup: await generateKeyboardWithImageFormats(context.message.message_id.toString()),
        })
    }
}
