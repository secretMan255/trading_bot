import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto'

@Injectable()
export class BitgetService {
    private readonly apiKey: string
    private readonly secret: string
    private readonly passphrase: string
    private readonly baseUrl: string

    constructor(private readonly config: ConfigService) {
        this.apiKey = this.config.get('BITGET_API_KEY') || ''
        this.secret = this.config.get('') || ''
        this.secret = this.config.get('BITGET_API_SECRET') || ''
        this.passphrase = this.config.get('BITGET_PASSPHRASE') || ''
        this.baseUrl = this.config.get('BITGET_BASE_URL') || 'https://api.bitget.com'
    }

    private sign(timestamp: string, method: string, requestPath: string, body = '') {
        return crypto.createHmac('sha256', this.secret).update(`${timestamp}${method}${requestPath}${body}`).digest('base64')
    }

    async placeOrder({ symbol, side, size }: { symbol: string, side: 'buy' | 'sell', size: number }) {
        const requestPath: string = '/api/mix/v1/order/placeOrder'
        const url: string = this.baseUrl + requestPath
        const timestamp: string = Date.now().toString()

        const bodyObj: Record<string, string> = {
            symbol,
            marginCoin: 'USDT',
            size: size.toString(),
            side,
            orderType: 'market',
            productType: 'UMCBL'
        }

        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.sign(timestamp, 'POST', requestPath, JSON.stringify(bodyObj)),
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-PASSPHRASE': this.passphrase,
            'Content-Type': 'application/json'
        }

        const res = await axios.post(url, bodyObj, { headers })
        return res.data
    }
}