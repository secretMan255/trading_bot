import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';

export const validatePipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
export function ErrorExceptoin(status: HttpStatus, msg: string) {
    throw new HttpException({
        status: -1,
        message: msg
    },
        status
    )
}