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

    constructor(private readonly config: ConfigService) {
        this.apiKey = this.config.get('BITGET_API_KEY') || ''
        this.secret = this.config.get('BITGET_API_SECRET') || ''
        this.passphrase = this.config.get('BITGET_PASSPHRASE') || ''
        this.baseUrl = this.config.get('BITGET_BASE_URL') || 'https://api.bitget.com'
    }

    private sign(timestamp: string, method: string, requestPath: string, body = '') {
        return crypto.createHmac('sha256', this.secret).update(`${timestamp}${method.toUpperCase()}${requestPath}${body}`).digest('base64')
    }

    public async getAccountOverall() {
        const requestPath: string = '/api/v2/account/all-account-balance'
        const timestamp: string = Date.now().toString()

        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.sign(timestamp, 'GET', requestPath, ''),
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-PASSPHRASE': this.passphrase
        }

        const res = await axios.get(this.baseUrl + requestPath, { headers })
        return res.data
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

    public async getHistoryOrder(params?: GetTransactionsDto) {
        const requestPath: string = '/api/v2/spot/trade/history-orders'
        const timestamp: string = Date.now().toString()

        const query: Record<string, string> = {}

        if (params?.symbol) query.symbol = params.symbol
        if (params?.startTime) query.startTime = params.startTime
        if (params?.endTime) query.endTime = params.endTime

        const queryString: string = new URLSearchParams(query).toString()

        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.sign(timestamp, 'GET', requestPath, ''),
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-PASSPHRASE': this.passphrase,
            'Content-Type': 'application/json',
            'paptrading': '1' // demo trading
        }

        const res = await axios.get(this.baseUrl + `${requestPath}?${queryString}`, { headers })
        return res.data
    }

    public async getUnfilledOrder(params?: GetTransactionsDto) {
        const requestPath: string = '/api/v2/spot/trade/unfilled-orders'
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
        const timestamp: string = Date.now().toString()

        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.sign(timestamp, 'GET', requestPath, ''),
            'ACCESS-PASSPHRASE': this.passphrase,
            'ACCESS-TIMESTAMP': timestamp,
            'locale': 'en-US',
            'Content-Type': 'application/json',
            'paptrading': '1' // demo trading
        }

        const res = await axios.get(this.baseUrl + `${requestPath}?${queryString}`, { headers })
        return res.data
    }

    public async getSpotTransactions(params: GetTransactionsDto) {
        const requestPath: string = '/api/v2/tax/spot-record'
        const query: Record<string, string> = {
            startTime: params.startTime,
        }
        if (params?.endTime) query.endTime = params.endTime
        if (params?.limit) query.limit = params.limit
        if (params?.coin) query.coin = params.coin
        if (params?.idLessThan) query.idLessThan = params.idLessThan

        const queryString: string = new URLSearchParams(query).toString()
        const timestamp: string = Date.now().toString()

        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.sign(timestamp, 'GET', requestPath, ''),
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-PASSPHRASE': this.passphrase,
            'locate': 'en-US',
            'Content-Type': 'application/json'
        }

        const res = await axios.get(`${this.baseUrl}${requestPath}?${queryString}`, { headers })
        return res.data
    }

    public async getFutureTransactions(params: GetTransactionsDto) {
        const requestPath: string = '/api/v2/tax/future-record'
        const query: Record<string, string> = {
            startTime: params.startTime,
            endTime: params.endTime
        }

        if (params?.productType) query.productType = params.productType
        if (params?.marginCoin) query.marginCoin = params.marginCoin
        if (params?.limit) query.limit = params.limit
        if (params?.idLessThan) query.idLessThan = params.idLessThan

        const queryString: string = new URLSearchParams(query).toString()
        const timestamp: string = Date.now().toString()

        const headers: Record<string, string> = {
            'ACCESS-KEY': this.apiKey,
            'ACCESS-SIGN': this.sign(timestamp, 'GET', requestPath, ''),
            'ACCESS-TIMESTAMP': timestamp,
            'ACCESS-PASSPHRASE': this.passphrase,
            'locate': 'en-US',
            'Content-Type': 'application/json'
        }

        const res = await axios.get(`${this.baseUrl}${requestPath}?${queryString}`, { headers })
        return res.data
    }

    public async placeFutureOrder({ symbol, side, orderType, size }: PlaceOrder) {
        const requestPath: string = '/api/mix/v2/order/placeOrder'
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
            'Content-Type': 'application/json',
            paptrading: '1'
        }

        const res = await axios.post(url, bodyObj, { headers })
        return res.data
    }

    public async placeSpotORder({ symbol, side, orderType, size }: PlaceOrder) {
        const requestPath: string = '/api/spot/v2/trade/placeOrder'
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
            'Content-Type': 'application/json',
            paptrading: '1'
        }

        const res = await axios.post(url, bodyObj, { headers })
        return res.data
    }
}