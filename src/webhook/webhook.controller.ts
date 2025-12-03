import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BitgetService } from './bitget.service'

@Controller('tv-webhook')
export class WebhookController {
    private readonly secret: string

    constructor(
        private readonly config: ConfigService,
        private readonly bitgetService: BitgetService
    ) {
        this.secret = this.config.get('TV_WEBHOOK_SECRET') || ''
    }

    @Post()
    async onSignal(@Body() body: any) {
        if (body.secret !== this.secret) throw new UnauthorizedException('Invalid Secret')

        const res = await this.bitgetService.placeOrder({
            symbol: body.symbol || 'BTCUSDT_UMCBL',
            side: body.side === 'BUY' ? 'buy' : 'sell',
            size: Number(body.qty || 0.01)
        })

        return { status: 0, bitget: res }
    }
}