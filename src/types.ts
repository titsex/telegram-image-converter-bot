import { Context, NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/types'

export type HandlerType = 'photo' | 'document'
export type ImageFormatType = 'avif' | 'jpeg' | 'jpg' | 'jpe' | 'png' | 'tiff' | 'tif' | 'webp'

export interface IModule {
    name: string
    description: string
    callback: (context: Context) => void
}

export interface IHandler {
    name: HandlerType
    callback: (context: NarrowedContext<Context, Update>) => void
}
