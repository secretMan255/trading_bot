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

export class PlaceOrderDto {
    @IsString()
    @IsNotEmpty()
    secret: string

    @IsString()
    @IsNotEmpty()
    symbol: string

    @IsEnum(OrderSide, {
        message: 'side must be either buy or sell'
    })
    side: OrderSide

    @IsNumber()
    qty: string
}