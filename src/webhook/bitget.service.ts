import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto'
import { GetTransactionsDto, PlaceOrder } from './webhook.dto';

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
        return crypto.createHmac('sha256', this.secret).update(`${timestamp}${method.toUpperCase()}${requestPath}${body}`).digest('base64')
    }

    public async getSpotTikets(symbol?: string) {
        let url: string = `${this.baseUrl}/api/v2/spot/market/tickers`
        if (symbol) url += `?symbol=${encodeURIComponent(symbol)}`

        const res = await axios.get(url)
        return res.data
    }

    public async getFutureTicker(productType: string, symbol: string) {
        let url: string = `${this.baseUrl}/api/v2/mix/market/tickers`
        if (symbol) url += `?productType=${encodeURIComponent(productType)}&symbol=${encodeURIComponent(symbol)}`

        const res = await axios.get(url)
        return res.data
    }

    public async getSpotTransactions(params: GetTransactionsDto) {
        const requestPath: string = '/api/v2/tax/spot-record'

        const query: Record<string, string> = {
            startTime: params.startTime,
        }
        if (params.endTime) query.endTime = params.endTime
        if (params.limit) query.limit = params.limit
        if (params.coin) query.coin = params.coin
        if (params.idLessThan) query.idLessThan = params.idLessThan

        const queryString: string = new URLSearchParams(query).toString()
        const pathForSign: string = `${requestPath}?${queryString}`
        const timestamp: string = Date.now().toString()

        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.sign(timestamp, 'GET', pathForSign, ''),
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-PASSPHRASE': this.passphrase,
            'locate': 'en-US',
            'Content-Type': 'application/json'
        }

        const res = await axios.get(`${this.baseUrl}${pathForSign}`, { headers })
        return res.data
    }

    public async getFutureTransactions(params: GetTransactionsDto) {
        const requestPath: string = '/api/v2/tax/future-record'

        const query: Record<string, string> = {
            startTime: params.startTime,
            endTime: params.endTime
        }

        if (params.productType) query.productType = params.productType
        if (params.marginCoin) query.marginCoin = params.marginCoin
        if (params.limit) query.limit = params.limit
        if (params.idLessThan) query.idLessThan = params.idLessThan

        const queryString: string = new URLSearchParams(query).toString()
        const pathForSign: string = `${requestPath}?${queryString}`
        const timestamp: string = Date.now().toString()

        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.sign(timestamp, 'GET', pathForSign, ''),
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-PASSPHRASE': this.passphrase,
            'locate': 'en-US',
            'Content-Type': 'application/json'
        }

        const res = await axios.get(`${this.baseUrl}${pathForSign}`, { headers })
        return res.data
    }

    public async placeFutureOrder({ symbol, side, orderType, size }: PlaceOrder) {
        const requestPath: string = '/api/mix/v1/order/placeOrder'
        const url: string = this.baseUrl + requestPath
        const timestamp: string = Date.now().toString()

        const bodyObj: Record<string, string> = {
            symbol,
            marginCoin: 'USDT',
            size: size.toString(),
            side,
            orderType,
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

    public async placeSpotORder({ symbol, side, orderType, size }: PlaceOrder) {
        const requestPath: string = '/api/spot/v1/trade/placeOrder'
        const url: string = this.baseUrl + requestPath
        const timestamp: string = Date.now().toString()

        const bodyObj: Record<string, string> = {
            symbol,
            side,
            orderType,
            force: 'gtc',
            quantity: size.toString()
        }

        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.sign(timestamp, 'POST', requestPath, JSON.stringify(bodyObj)),
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-PASSPHASE': this.passphrase,
            'Content-Type': 'application/json'
        }

        const res = await axios.post(url, bodyObj, { headers })
        return res.data
    }
}