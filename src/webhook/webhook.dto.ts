import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsEnum,
    IsOptional
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

export class GetTransactionsDto {
    @IsString()
    @IsOptional()
    productType: string

    @IsString()
    @IsOptional()
    marginCoin: string

    @IsString()
    @IsOptional()
    coin: string

    @IsString()
    @IsNotEmpty()
    startTime: string

    @IsString()
    @IsOptional()
    endTime: string

    @IsString()
    @IsOptional()
    limit: string

    @IsString()
    @IsOptional()
    idLessThan: string
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