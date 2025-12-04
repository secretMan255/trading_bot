import { Body, Controller, Get, Param, Post, UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BitgetService } from './bitget.service'
import { validatePipe } from 'src/utils'
import { GetTransactionsDto, PlaceOrderDto } from './webhook.dto'
import { JwtAuthGuard } from 'src/guard/auth/jwt.auth.guard'

@Controller('bitget')
export class WebhookController {
    // private readonly secret: string

    constructor(
        private readonly config: ConfigService,
        private readonly bitgetService: BitgetService
    ) {
        // this.secret = this.config.get('TV_WEBHOOK_SECRET') || ''
    }

    @Get('transactions/spot')
    @UseGuards(JwtAuthGuard)
    @UsePipes(validatePipe)
    async getSpotTransactions(@Param() params: GetTransactionsDto) {
        const res = await this.bitgetService.getSpotTransactions(params)

        return { status: 0, data: res }
    }

    @Get('transactions/future')
    @UseGuards(JwtAuthGuard)
    @UsePipes(validatePipe)
    async getFutureTransactions(@Param() params: GetTransactionsDto) {
        const res = await this.bitgetService.getFutureTransactions(params)

        return { status: 0, data: res }
    }

    @Post('placeOrder/future')
    @UseGuards(JwtAuthGuard)
    @UsePipes(validatePipe)
    async placeFutureOrder(@Body() body: PlaceOrderDto) {
        // if (body.secret !== this.secret) throw new UnauthorizedException('Invalid Secret')
        const res = await this.bitgetService.placeFutureOrder({
            symbol: body.symbol,
            side: body.side,
            orderType: body.orderType,
            size: Number(body.qty)
        })

        return { status: 0, data: res }
    }

    @Post('placeOrder/spot')
    @UseGuards(JwtAuthGuard)
    @UsePipes(validatePipe)
    async placeSpotOrder(@Body() body: PlaceOrderDto) {
        const res = await this.bitgetService.placeSpotORder({
            symbol: body.symbol,
            side: body.side,
            orderType: body.orderType,
            size: Number(body.qty)
        })

        return { status: 0, data: res }
    }
}