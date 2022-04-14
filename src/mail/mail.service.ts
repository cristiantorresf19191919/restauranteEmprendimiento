import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Restaurant } from 'src/types/user';

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: Restaurant, token:string){
        // const url = `http:localhost:3500/auth/validate?token=${token}`
        await this.mailerService.sendMail({
            to:user.email,
            subject: 'Bienvenido a Eatlify',
            template: 'confirmation',
            context:{
                name:user.name,
                phone:user.phone,
                plan:user.selectedPlan,
                image:user.image.url,
                longitude:user.selectedLocation.longitude,
                latitude:user.selectedLocation.latitude,
            }   
        })
    }

}
