import { IContext } from '@types'

export default async function diceHandler(context: IContext) {
    return await context.reply('[ERROR] Send me the image!')
}
