import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';
import { Cloudinary } from './cloudinary';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser:true,
      useUnifiedTopology: true,    
    }),
    RestaurantsModule,
    AuthModule,
    MailModule,
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService, Cloudinary],
})
export class AppModule {}
