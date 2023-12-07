import responseHandler from '@handler/actions/-response.handler'

import { extendContext, resizeImage } from '@utils'
import { Message, Document } from 'telegraf/types'
import { IContext, ResizeFitType } from '@types'

export default async function messageHandler(context: IContext, next: () => Promise<void>) {
    extendContext(context)

    if (!('text' in context.message!)) return next()

    const requests = context.session.requests.get(context.message!.from.id)
    if (!requests?.length) return await context.reply('[ERROR] Send me the image!')

    for (const request of requests) {
        const payload = request.url.split('.').at(-1)

        let message = {} as Message

        switch (request.type) {
            case 'resize':
                if (!/(\d+?)[xх](\d+)/i.test(context.message.text))
                    return await context.reply('Specify the size in the (width X height) format. For example, 640x400.')

                const [width, height] = context.message.text.split(/[xх]/i)

                message = await context.replyWithDocument({
                    source: await resizeImage(request.url, +width, +height, request.payload as ResizeFitType),
                    filename: `resized.${payload}`,
                })

                if (payload === 'webp' && 'sticker' in message) message.document = message.sticker as Document

                break
        }

        return await responseHandler(context, message, request)
    }
}
