import { Context } from 'telegraf'
import { modules } from '@index'

export default async function help(context: Context) {
    return context.reply(
        `To get started, you need to send me an image or sticker, select one of the actions and follow the instructions below!\n\nList of available commands:${modules
            .map((module) => (module.name === 'help' ? '' : `/${module.name} - ${module.description}`))
            .join('\n')}`
    )
}
