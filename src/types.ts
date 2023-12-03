import { Context, NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/types'

export type HandlerType = 'photo' | 'document'

export type ActionType = 'convert' | 'resize'

export type ImageFormatType = 'avif' | 'jpeg' | 'jpg' | 'jpe' | 'png' | 'tiff' | 'tif' | 'webp'

export type ActionMatchType = [type: ActionType, userId: string, fileId: string, payload: string]

export interface ISession {
    requests: Map<number, IActionCache[]>
}

export interface IContext extends Context {
    session: ISession
}

export interface IActionCache {
    fileId: string
    fileUniqueId: string
    url: string
    type?: ActionType
}

export interface IModule {
    name: string
    description: string
    callback: (context: Context) => void
}

export interface IHandler {
    name: HandlerType
    callback: (context: NarrowedContext<Context, Update>) => void
}
