import { Context, NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/types'

export default async function photo(context: NarrowedContext<Context, Update>) {
    if ('photo' in context.message!) {
        const betterPhoto = context.message.photo.sort((a, b) => b.file_size! - a.file_size!)[0]

        const { href } = await context.telegram.getFileLink(betterPhoto.file_id)

        console.log(href) // TODO: handle image!
    }
}
