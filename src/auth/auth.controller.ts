import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { Restaurant } from 'src/types/user';
import { LoginDTO, RegisterDTO } from 'src/restaurants/register.dto';
import { RestaurantService } from 'src/restaurants/restaurants.service';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(
        private restaurantService: RestaurantService,
        private authService: AuthService,  
        private mailService: MailService      
      ) {}

      @Post('register')   
      @UseInterceptors(FileInterceptor('image'))
      async register(@Body() registerDTO: RegisterDTO, @UploadedFile() file: Express.Multer.File) {    

      const user:Restaurant = await this.restaurantService.create(registerDTO, file);
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
        const user:Restaurant = await this.restaurantService.findByLogin(UserDTO);
        const payload = {
          email: user.email,
        };
        const token = await this.authService.signPayload(payload);
        return { user, token};
      }


}
