import { Body, Controller, Post, UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BitgetService } from './bitget.service'
import { validatePipe } from 'src/utils'
import { PlaceOrderDto } from './webhook.dto'
import { JwtAuthGuard } from 'src/guard/auth/jwt.auth.guard'

@Controller('tv-webhook')
export class WebhookController {
    // private readonly secret: string

    constructor(
        private readonly config: ConfigService,
        private readonly bitgetService: BitgetService
    ) {
        // this.secret = this.config.get('TV_WEBHOOK_SECRET') || ''
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(validatePipe)
    async onSignal(@Body() body: PlaceOrderDto) {
        // if (body.secret !== this.secret) throw new UnauthorizedException('Invalid Secret')
        const res = await this.bitgetService.placeOrder({
            symbol: body.symbol,
            side: body.side,
            size: Number(body.qty)
        })

        return { status: 0, bitget: res }
    }
}