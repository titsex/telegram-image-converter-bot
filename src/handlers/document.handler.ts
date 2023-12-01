import { generateKeyboardWithImageFormats } from '@utils'
import { Context, NarrowedContext } from 'telegraf'
import { cache, imageFormats } from '@constants'
import { ImageFormatType } from '@types'
import { Update } from 'telegraf/types'

export default async function documentHandler(context: NarrowedContext<Context, Update>) {
    if ('document' in context.message!) {
        const document = context.message.document

        if (!imageFormats.includes(document.mime_type!.split('/')[1] as ImageFormatType))
            return context.reply('[ERROR] The document extension must be an image!')

        cache.set(context.message.message_id.toString(), document.file_id)

        return await context.reply('Select the format to convert:', {
            reply_markup: await generateKeyboardWithImageFormats(context.message.message_id.toString()),
        })
    }
}
