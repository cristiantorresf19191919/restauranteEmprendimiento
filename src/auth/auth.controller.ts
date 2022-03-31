import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/types/user';
import { LoginDTO, RegisterDTO } from 'src/user/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService,  
        private mailService: MailService      
      ) {}

      @Post('register')
      async register(@Body() registerDTO: RegisterDTO) {        
        const user:User = await this.userService.create(registerDTO);
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
        const user:User = await this.userService.findByLogin(UserDTO);
        const payload = {
          email: user.email,
        };
        const token = await this.authService.signPayload(payload);
        return { user, token};
      }


}
