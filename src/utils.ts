import sharp, { AvailableFormatInfo } from 'sharp'
import Logger from '@class/Logger'
import axios from 'axios'

import { HandlerType, IHandler, ImageFormatType, IModule } from '@types'
import { imageFormats } from '@constants'
import { Markup } from 'telegraf'
import { readdirSync } from 'fs'
import { join } from 'path'

export async function collectModules(modulesPath: string): Promise<IModule[]> {
    const modules: IModule[] = []

    const dir = readdirSync(modulesPath)

    for (const file of dir) {
        const module = await import(`file://${join(modulesPath, file)}`)

        const name = file.split('.')[0]

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

        const name = file.split('.')[0] as HandlerType

        handlers.push({
            name,
            callback: handler.default.default,
        })

        Logger.handler(name)
    }

    return handlers
}

export async function convertImage(url: string, format: ImageFormatType) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data)

    return await sharp(buffer)
        .toFormat(format as unknown as AvailableFormatInfo)
        .toBuffer()
}

export async function generateKeyboardWithImageFormats(messageId: string) {
    const buttons = []

    for (const format of imageFormats) {
        const button = Markup.button.callback(format, `convert-${messageId}-${format}`)
        buttons.push(button)
    }

    return Markup.inlineKeyboard(buttons, { columns: 2 }).reply_markup
}
