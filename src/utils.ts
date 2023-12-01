import Logger from '@class/Logger'

import { HandlerType, IHandler, IModule } from '@types'
import { readdirSync } from 'fs'
import { join } from 'path'

export async function collectModules(modulesPath: string): Promise<IModule[]> {
    const modules: IModule[] = []

    const dir = readdirSync(modulesPath)

    for (const file of dir) {
        const module = await import(`file://${join(modulesPath, file)}`)

        const name = file.match(/(.+?)\./i)![1]

        modules.push({
            name,
            description: module.description,
            callback: module.default.default,
        })

        Logger.module(name)
    }

    return modules
}

export async function collectHandlers(handlersPath: string): Promise<IHandler[]> {
    const handlers: IHandler[] = []

    const dir = readdirSync(handlersPath)

    for (const file of dir) {
        const handler = await import(`file://${join(handlersPath, file)}`)

        const name = file.match(/(.+?)\./i)![1] as HandlerType

        handlers.push({
            name,
            callback: handler.default.default,
        })

        Logger.handler(name, 'loaded')
    }

    return handlers
}
