import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppCronService {
    private readonly logger = new Logger(AppCronService.name)

    // @Cron('* * * * * *')
    // spam() {
    //     this.logger.log('Cron running: every sec')
    // }
}