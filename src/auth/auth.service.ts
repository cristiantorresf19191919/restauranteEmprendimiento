import { Injectable, Inject } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { RestaurantService } from 'src/restaurants/restaurants.service';
import { Payload } from 'src/types/payload';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class AuthService {
    constructor(private userService: RestaurantService,
      @Inject(CloudinaryService) private readonly cloudinaryService : CloudinaryService
      ) {}
    async signPayload(payload: Payload) {
        return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
      }      
}
