import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('support_level')
@Index(['symbol', 'timeframe'])
export class SupportLevelEntity {
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        unsigned: true
    })
    id: number

    @Column({ length: 10 })
    symbol: string

    @Column({ length: 10 })
    timeframe: string

    @Column({ type: 'tinyint', default: 2 })
    level_type: number

    @Column({ type: 'decimal', precision: 24, scale: 12 })
    price: string

    @Column({ type: 'decimal', precision: 24, scale: 12 })
    lower: string

    @Column({ type: 'decimal', precision: 24, scale: 12 })
    upper: string

    @Column({ type: 'int' })
    touches: number

    @Column({ type: 'datetime' })
    last_touch: Date

    @Column({ type: 'tinyint', default: 1 })
    status: number
}