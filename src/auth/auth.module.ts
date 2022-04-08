import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountsModule } from 'src/accounts/accounts.module';
import { MailModule } from 'src/mail/mail.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[AccountsModule,MailModule,CloudinaryModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
