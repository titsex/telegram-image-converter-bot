import { extendContext, resizeImage } from '@utils'
import { IContext } from '@types'
export default async function messageHandler(context: IContext, next: () => Promise<void>) {
    extendContext(context)

    if (!('text' in context.message!)) return next()

    const requests = context.session.requests.get(context.message!.from.id)
    if (!requests?.length) return await context.reply('[ERROR] Send me the image!')

    for (const request of requests) {
        switch (request.type) {
            case 'resize':
                if (!/(\d+?)[xх](\d+)/i.test(context.message.text))
                    return await context.reply('Specify the size in the (width X height) format. For example, 640x400.')

                const [width, height] = context.message.text.split(/[xх]/i)

                context.session.requests.set(
                    context.message.from.id,
                    requests.filter((file) => file.fileUniqueId !== request.fileUniqueId)
                )

                return await context.replyWithDocument(
                    {
                        source: await resizeImage(request.url, +width, +height),
                        filename: `resized.${request.url.split('.').at(-1)}`,
                    },
                    {
                        caption: 'Thanks for waiting.',
                    }
                )
        }
    }
}
