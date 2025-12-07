import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto'
import { GetTransactionsDto, PlaceOrder } from './bitget.dto';

@Injectable()
export class BitgetService {
    private readonly apiKey: string
    private readonly secret: string
    private readonly passphrase: string
    private readonly baseUrl: string
    private readonly demoMode: boolean

    constructor(private readonly config: ConfigService) {
        this.apiKey = this.config.get('BITGET_API_KEY') || ''
        this.secret = this.config.get('BITGET_API_SECRET') || ''
        this.passphrase = this.config.get('BITGET_PASSPHRASE') || ''
        this.baseUrl = this.config.get('BITGET_BASE_URL') || 'https://api.bitget.com'
        this.demoMode = this.config.get('BITGET_DEMO') || false
    }

    private signature(timestamp: string, method: 'GET' | 'POST', requestPath: string, queryString?: string, body?: any) {
        const qs: string = queryString ? `?${queryString}` : ''
        const bodyStr: string = body ? JSON.stringify(body) : ''

        return crypto.createHmac('sha256', this.secret).update(`${timestamp}${method.toUpperCase()}${requestPath}${qs}${bodyStr}`).digest('base64')
    }

    public async get(requestPath: string, queryString?: string) {
        const timestamp = Date.now().toString()
        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.signature(timestamp, 'GET', requestPath, queryString),
            'ACCESS-PASSPHRASE': this.passphrase,
            'ACCESS-TIMESTAMP': timestamp,
            'locale': 'en-US',
            'Content-Type': 'application/json',
        }

        if (this.demoMode) headers.paptrading = '1'
        const rq: string = queryString ? `${requestPath}?${queryString}` : requestPath
        return await axios.get(this.baseUrl + rq, { headers })
    }

    public async post(requestPath: string, body: any) {
        const timestamp = Date.now().toString()
        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.signature(timestamp, 'POST', requestPath, '', body),
            'ACCESS-PASSPHRASE': this.passphrase,
            'ACCESS-TIMESTAMP': timestamp,
            'locale': 'en-US',
            'Content-Type': 'application/json',
        }

        if (this.demoMode) headers.paptrading = '1'
        return await axios.post(this.baseUrl + requestPath, body, { headers })
    }

    public async getAccountOverall() {
        const spot = await this.get('/api/v2/spot/account/assets')
        const future = await this.get('/api/v2/mix/account/accounts?productType=USDT-FUTURES')
        return { spot: spot.data.data, future: future.data.data }
    }

    public async getSpotTikets(symbol?: string) {
        let url: string = `${this.baseUrl}/api/v2/spot/market/tickers`
        if (symbol) url += `?symbol=${encodeURIComponent(symbol)}`

        const res = await axios.get(url)
        return res.data
    }

    public async getFutureTicker(productType: string, symbol: string) {
        let url: string = `${this.baseUrl}/api/v2/mix/market/ticker`
        if (symbol) url += `?productType=${encodeURIComponent(productType)}&symbol=${encodeURIComponent(symbol)}`

        const res = await axios.get(url)
        return res.data
    }

    public async getFutureCandles(symbol: string, granularity: number, limit: number = 500) {
        const params = new URLSearchParams({
            symbol,
            productType: 'USDT-FUTURES',
            granularity: String(granularity),
            limit: String(limit),
        })

        const res = await axios.get(`${this.baseUrl}/api/v2/mix/market/candles?${params.toString()}`)
        const sorted = res.data.data.slice().reverse()

        return sorted.map((r) => ({
            ts: Number(r[0]),
            open: Number(r[1]),
            high: Number(r[2]),
            low: Number(r[3]),
            close: Number(r[4]),
            volume: Number(r[5] ?? 0)
        }))
    }

    public async getHistoryOrder(params?: GetTransactionsDto) {
        const query: Record<string, string> = {}

        if (params?.symbol) query.symbol = params.symbol
        if (params?.startTime) query.startTime = params.startTime
        if (params?.endTime) query.endTime = params.endTime

        const queryString: string = new URLSearchParams(query).toString()

        const res = await this.get('/api/v2/spot/trade/history-orders', queryString)
        return res.data
    }

    public async getUnfilledOrder(params?: GetTransactionsDto) {
        const query: Record<string, string> = {}

        if (params?.symbol) query.symbol = params.symbol
        if (params?.startTime) query.startTime = params.startTime
        if (params?.endTime) query.endTime = params.endTime
        if (params?.idLessThan) query.idLessThan = params.idLessThan
        if (params?.limit) query.limit = params.limit
        if (params?.orderId) query.orderId = params.orderId
        if (params?.tpslType) query.tpslType = params.tpslType
        if (params?.requestTime) query.requestTime = params.requestTime
        if (params?.receiveWindow) query.receiveWindow = params.receiveWindow

        const queryString: string = new URLSearchParams(query).toString()

        const res = await this.get('/api/v2/spot/trade/unfilled-orders', queryString)
        return res.data
    }

    public async getSpotTransactions(params: GetTransactionsDto) {
        const query: Record<string, string> = {
            startTime: params.startTime,
        }
        if (params?.endTime) query.endTime = params.endTime
        if (params?.limit) query.limit = params.limit
        if (params?.coin) query.coin = params.coin
        if (params?.idLessThan) query.idLessThan = params.idLessThan

        const queryString: string = new URLSearchParams(query).toString()

        const res = await this.get('/api/v2/tax/spot-record', queryString)
        return res.data
    }

    public async getFutureTransactions(params: GetTransactionsDto) {
        const query: Record<string, string> = {
            startTime: params.startTime,
            endTime: params.endTime
        }

        if (params?.productType) query.productType = params.productType
        if (params?.marginCoin) query.marginCoin = params.marginCoin
        if (params?.limit) query.limit = params.limit
        if (params?.idLessThan) query.idLessThan = params.idLessThan

        const queryString: string = new URLSearchParams(query).toString()

        const res = await this.get('/api/v2/tax/future-record', queryString)
        return res.data
    }

    public async placeFutureOrder({ symbol, side, orderType, size }: PlaceOrder) {
        const bodyObj: Record<string, string> = {
            symbol,
            marginCoin: 'USDT',
            size: size.toString(),
            side,
            orderType,
            productType: 'UMCBL'
        }

        const res = await this.post('/api/v2/mix/order/place-order', bodyObj)
        return res.data
    }

    public async placeSpotORder({ symbol, side, orderType, size }: PlaceOrder) {
        const bodyObj: Record<string, string> = {
            symbol,
            side,
            orderType,
            force: 'gtc',
            quantity: size.toString()
        }

        const res = await this.post('/api/spot/v2/trade/place-order', bodyObj)
        return res.data
    }
}