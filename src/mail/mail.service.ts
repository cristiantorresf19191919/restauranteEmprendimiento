import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Account } from 'src/types/user';

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: Account, token:string){
        // const url = `http:localhost:3500/auth/validate?token=${token}`
        await this.mailerService.sendMail({
            to:user.email,
            subject: 'Bienvenido a Eatlify',
            template: 'confirmation',
            context:{
                name:user.name,
                phone:user.phone,
                plan:user.selectedPlan
            }
        })
    }

}
