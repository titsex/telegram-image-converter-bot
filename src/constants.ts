import { ActionType, ImageFormatType, ResizeFitType } from '@types'
import { join } from 'path'

export const modulesPath = join(__dirname, 'modules')
export const handlersPath = join(__dirname, 'handlers')

export const imageFormats: ImageFormatType[] = ['avif', 'jpeg', 'jpg', 'jpe', 'png', 'tiff', 'tif', 'webp']

export const resizeFitFormats: ResizeFitType[] = ['fill', 'cover', 'inside', 'contain', 'outside']

export const actionTypes: ActionType[] = ['convert', 'resize']

export const COLORS: Record<string, string> = {
    NONE: '\x1b[0',
    CYAN: '\x1b[36',
    RED: '\x1b[31',
    YELLOW: '\x1b[33',
    MAGENTA: '\x1b[35',
    GREEN: '\x1b[32',
    BLUE: '\x1b[34',
    CHILI: '\x1b[91',
}

export const FONT_WEIGHT: Record<string, string> = {
    NONE: 'm',
    BOLD: ';1m',
}
