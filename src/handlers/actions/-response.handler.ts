import { generateKeyboardWithActions } from '@utils'
import { IActionCache, IContext } from '@types'
import { Message } from 'telegraf/types'

export default async function responseHandler(context: IContext, message: Message, request: IActionCache) {
    if (!('document' in message)) return

    delete request.type
    request.fileId = message.document.file_id
    request.fileUniqueId = message.document.file_unique_id
    request.url = (await context.telegram.getFileLink(request.fileId)).toString()

    return await context.telegram.editMessageReplyMarkup(
        message.chat.id,
        message.message_id,
        '',
        generateKeyboardWithActions(`${message.chat.id}`, request.fileUniqueId)
    )
}
