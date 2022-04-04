import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { Account } from 'src/types/user';
import { LoginDTO, RegisterDTO } from 'src/accounts/register.dto';
import { AccountService } from 'src/accounts/accounts.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private accountService: AccountService,
        private authService: AuthService,  
        private mailService: MailService      
      ) {}

      @Post('register')
      async register(@Body() registerDTO: RegisterDTO) {        
        const user:Account = await this.accountService.create(registerDTO);
        const payload = {        
          email: user.email,
        };    
        const token = await this.authService.signPayload(payload);
        // send the email
        this.mailService.sendUserConfirmation(user,token);
        return { user, token };
      }

      @Post('login')
      async login(@Body() UserDTO: LoginDTO) {
        const user:Account = await this.accountService.findByLogin(UserDTO);
        const payload = {
          email: user.email,
        };
        const token = await this.authService.signPayload(payload);
        return { user, token};
      }


}
