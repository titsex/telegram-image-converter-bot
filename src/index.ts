import messageHandler from '@handler/-message.handler'
import actionHandler from '@handler/-action.handler'
import Logger from '@class/Logger'

import { actionTypes, handlersPath, modulesPath } from '@constants'
import { collectHandlers, collectModules } from '@utils'
import { IContext, IHandler, IModule } from '@types'
import { session, Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

export let modules: IModule[] = []
export let handlers: IHandler[] = []

const start = async () => {
    Logger.info('Starting the bot...')

    const bot = new Telegraf<IContext>(process.env.TOKEN!)

    bot.use(session())

    modules = await collectModules(modulesPath)
    handlers = await collectHandlers(handlersPath)

    for (const module of modules) {
        bot.command(module.name, module.callback)
        Logger.command(module.name)
    }

    bot.on('message', messageHandler)

    for (const handler of handlers) {
        bot.on(message(handler.name), handler.callback)
        Logger.middleware(handler.name)
    }

    bot.action(new RegExp(`(${actionTypes.join('|')})~(.+)~(.+)(?:~(.+)|)`, 'i'), actionHandler)

    Logger.info('Bot has been successfully started')
    await bot.launch()
}

start()
