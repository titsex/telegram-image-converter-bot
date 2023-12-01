import Logger from '@class/Logger'

import { collectHandlers, collectModules } from '@utils'
import { IHandler, IModule } from '@types'
import { message } from 'telegraf/filters'
import { Telegraf } from 'telegraf'
import { join } from 'path'

const modulesPath = join(__dirname, 'modules')
const handlersPath = join(__dirname, 'handlers')

export let modules: IModule[] = []
export let handlers: IHandler[] = []

const start = async () => {
    Logger.info('Starting the bot...')

    const bot = new Telegraf(process.env.TOKEN!)

    modules = await collectModules(modulesPath)
    handlers = await collectHandlers(handlersPath)

    for (const module of modules) {
        bot.command(module.name, module.callback)
        Logger.command(module.name)
    }

    for (const handler of handlers) {
        bot.on(message(handler.name), handler.callback)
        Logger.handler(handler.name, 'registered')
    }

    bot.on('message', async (context) => await context.reply('[ERROR] Send me the image!'))

    bot.launch()
}

start().then(() => Logger.info('Bot has been successfully started'))
