import { IContext } from '@types'

export default async function start(context: IContext) {
    return await context.reply(
        `Welcome!\n\nWith this bot, you can convert\nyour images to any format.\n\nUse the /help command to get more information.`
    )
}

export const description = 'General information about the bot'
