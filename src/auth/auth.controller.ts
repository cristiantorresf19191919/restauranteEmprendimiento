import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { Account } from 'src/types/user';
import { LoginDTO, RegisterDTO } from 'src/accounts/register.dto';
import { AccountService } from 'src/accounts/accounts.service';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(
        private accountService: AccountService,
        private authService: AuthService,  
        private mailService: MailService      
      ) {}

      @Post('register')   
      @UseInterceptors(FileInterceptor('image'))
      async register(@Body() registerDTO: RegisterDTO, @UploadedFile() file: Express.Multer.File) {     
      console.log("🚀 ~ file: auth.controller.ts ~ line 20 ~ AuthController ~ register ~ file", file)
      console.log("🚀 ~ file: auth.controller.ts ~ line 20 ~ AuthController ~ register ~ registerDTO", registerDTO)
      const user:Account = await this.accountService.create(registerDTO, file);
      const payload = {        
          email: user.email,
        };    
        const token = await this.authService.signPayload(payload);
        // send the email
        // this.mailService.sendUserConfirmation(user,token);
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
