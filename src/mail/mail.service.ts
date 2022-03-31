import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/types/user';

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: User, token:string){
        const url = `http:localhost:3500/auth/validate?token=${token}`
        await this.mailerService.sendMail({
            to:user.email,
            subject: 'Bienvenido a restauranteApp confirma tu email',
            template: 'confirmation',
            context:{
                name:user.email,
                url
            }
        })
    }

}
