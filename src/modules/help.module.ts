import { Context } from 'telegraf'
import { modules } from '@index'

export default async function help(context: Context) {
    return context.reply(
        `List of available commands:\n${modules
            .map((module) => (module.name === 'help' ? '' : `/${module.name} - ${module.description}`))
            .join('\n')}`
    )
}
