import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsEnum
} from 'class-validator';

export enum OrderSide {
    BUY = 'buy',
    SELL = 'sell'
}

export enum OrderType {
    MARKET = 'market',
    LIMIT = 'limit'
}

export interface PlaceOrder {
    symbol: string
    side: OrderSide
    orderType: OrderType
    size: number
}

export class PlaceOrderDto {
    // @IsString()
    // @IsNotEmpty()
    // secret: string

    @IsString()
    @IsNotEmpty()
    symbol: string

    @IsEnum(OrderSide, {
        message: 'side must be either buy or sell'
    })
    side: OrderSide

    @IsEnum(OrderType, {
        message: 'order type must be either market or limit'
    })
    orderType: OrderType

    @IsNumber()
    qty: string
}