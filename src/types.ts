import { Context, NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/types'

export type HandlerType = 'photo'

export interface IModule {
    name: string
    description: string
    callback: (context: Context) => void
}

export interface IHandler {
    name: HandlerType
    callback: (context: NarrowedContext<Context, Update>) => void
}
