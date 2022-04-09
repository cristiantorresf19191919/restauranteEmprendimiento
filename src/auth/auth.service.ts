import { Injectable, Inject } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { AccountService } from 'src/accounts/accounts.service';
import { Payload } from 'src/types/payload';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class AuthService {
    constructor(private userService: AccountService,
      @Inject(CloudinaryService) private readonly cloudinaryService : CloudinaryService
      ) {}
    async signPayload(payload: Payload) {
        return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
      }      
}
