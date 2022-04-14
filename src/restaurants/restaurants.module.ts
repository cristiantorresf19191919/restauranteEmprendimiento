import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { RestaurantSchema } from 'src/models/restaurants.schema';
import { RestaurantController } from './restaurants.controller';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name:'Restaurants', schema: RestaurantSchema}]),
    CloudinaryModule
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports:[RestaurantService]
})
export class RestaurantsModule {}
