const COLORS: Record<string, string> = {
    NONE: '\x1b[0',
    CYAN: '\x1b[36',
    RED: '\x1b[31',
    YELLOW: '\x1b[33',
    MAGENTA: '\x1b[35',
    GREEN: '\x1b[32',
    GRAY: '\x1b[90',
}

const FONT_WEIGHT: Record<string, string> = {
    NONE: 'm',
    BOLD: ';1m',
}

class Logger {
    private static defaultLogParams: string = `${COLORS.NONE + FONT_WEIGHT.NONE}`

    private static errorLogPrefix: string = `[${COLORS.RED + FONT_WEIGHT.BOLD}ERROR${Logger.defaultLogParams}]`
    private static infoLogPrefix: string = `[${COLORS.CYAN + FONT_WEIGHT.BOLD}INFO${Logger.defaultLogParams}]`
    private static moduleLogPrefix: string = `[${COLORS.MAGENTA + FONT_WEIGHT.BOLD}MODULE${Logger.defaultLogParams}]`
    private static commandLogPrefix: string = `[${COLORS.GREEN + FONT_WEIGHT.BOLD}COMMAND${Logger.defaultLogParams}]`
    private static handlerLogPrefix: string = `[${COLORS.GRAY + FONT_WEIGHT.BOLD}HANDLER${Logger.defaultLogParams}]`

    private static time(): string {
        return `${COLORS.YELLOW + FONT_WEIGHT.NONE}${new Date().toLocaleTimeString()}${COLORS.NONE}${FONT_WEIGHT.BOLD}`
    }

    public static info(...data: unknown[]): void {
        console.log(`${Logger.infoLogPrefix} ${Logger.time()}`, ...data, Logger.defaultLogParams)
    }

    public static error(...data: unknown[]): void {
        console.log(`${Logger.errorLogPrefix} ${Logger.time()}`, ...data, Logger.defaultLogParams)
    }

    public static module(name: string): void {
        console.log(
            `${Logger.moduleLogPrefix} ${Logger.time()}`,
            `${COLORS.CYAN + FONT_WEIGHT.BOLD}${name}${Logger.defaultLogParams} module was successfully loaded`,
            Logger.defaultLogParams
        )
    }

    public static command(name: string): void {
        console.log(
            `${Logger.commandLogPrefix} ${Logger.time()}`,
            `${COLORS.MAGENTA + FONT_WEIGHT.BOLD}${name}${Logger.defaultLogParams} command was successfully registered`,
            Logger.defaultLogParams
        )
    }

    public static handler(name: string, type: 'loaded' | 'registered'): void {
        console.log(
            `${Logger.handlerLogPrefix} ${Logger.time()}`,
            `${COLORS.GREEN + FONT_WEIGHT.BOLD}${name}${Logger.defaultLogParams} hander was successfully ${type}`,
            Logger.defaultLogParams
        )
    }
}

export default Logger
