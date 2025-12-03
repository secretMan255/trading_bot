import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WebhookController } from './webhook.controller'
import { BitgetService } from './bitget.service'

@Module({
    imports: [ConfigModule],
    controllers: [WebhookController],
    providers: [BitgetService]
})
export class WebhookModule { }
