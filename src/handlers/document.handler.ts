import { Context, NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/types'

export default async function document(context: NarrowedContext<Context, Update>) {
    if ('document' in context.message!) {
        const document = context.message.document

        if (!document.mime_type?.includes('image'))
            return context.reply('[ERROR] The document extenstion must be an image!')

        const { href } = await context.telegram.getFileLink(document.file_id)

        console.log(href) // TODO: handle image!
    }
}
