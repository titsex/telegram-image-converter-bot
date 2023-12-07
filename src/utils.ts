import sharp, { AvailableFormatInfo } from 'sharp'
import Logger from '@class/Logger'
import axios from 'axios'

import { HandlerType, IActionCache, IContext, IHandler, ImageFormatType, IModule, ResizeFitType } from '@types'
import { actionTypes, imageFormats, resizeFitFormats } from '@constants'
import { readdirSync, statSync } from 'fs'
import { Markup } from 'telegraf'
import { join } from 'path'

export async function collectModules(modulesPath: string): Promise<IModule[]> {
    const modules: IModule[] = []

    const dir = readdirSync(modulesPath)

    for (const file of dir) {
        if (statSync(join(modulesPath, file)).isDirectory()) continue

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
        if (file.startsWith('-')) continue
        if (statSync(join(handlersPath, file)).isDirectory()) continue

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

export async function resizeImage(url: string, width: number, height: number, fit: ResizeFitType) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data)

    return await sharp(buffer)
        .resize(width, height, {
            fit,
        })
        .toBuffer()
}
export function generateKeyboardWithResizeFitFormats(userId: string, fileUniqueId: string) {
    const buttons = []

    for (const fit of resizeFitFormats) {
        const button = Markup.button.callback(fit, `resize~${userId}~${fileUniqueId}~${fit}`)
        buttons.push(button)
    }

    return Markup.inlineKeyboard(buttons, { columns: 2 }).reply_markup
}

export function generateKeyboardWithImageFormats(userId: string, fileUniqueId: string) {
    const buttons = []

    for (const format of imageFormats) {
        const button = Markup.button.callback(format, `convert~${userId}~${fileUniqueId}~${format}`)
        buttons.push(button)
    }

    return Markup.inlineKeyboard(buttons, { columns: 2 }).reply_markup
}

export function generateKeyboardWithActions(userId: string, fileUniqueId: string) {
    const buttons = []

    for (const action of actionTypes) {
        const button = Markup.button.callback(action, `${action}~${userId}~${fileUniqueId}`)
        buttons.push(button)
    }

    return Markup.inlineKeyboard(buttons).reply_markup
}

export function extendContext(context: IContext) {
    context.session ??= { requests: new Map<number, IActionCache[]>() }
}
