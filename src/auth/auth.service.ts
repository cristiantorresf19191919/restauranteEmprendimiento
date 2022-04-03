import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { AccountService } from 'src/accounts/accounts.service';
import { Payload } from 'src/types/payload';
@Injectable()
export class AuthService {
    constructor(private userService: AccountService) {}
    async signPayload(payload: Payload) {
        return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
      }      
}
