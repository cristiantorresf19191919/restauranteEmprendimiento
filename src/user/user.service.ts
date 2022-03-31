import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/types/user';
import { LoginDTO, RegisterDTO } from './register.dto';
import * as bcrypt from "bcrypt"
import { Payload } from 'src/types/payload';


@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<User>
    ){}

    async create(registerDTO: RegisterDTO):Promise<User> {
        const { email } = registerDTO;
        const user = await this.userModel.findOne({ email });
        if (user) {
          throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
        }
        const createdUser = new this.userModel(registerDTO);
        await createdUser.save();
        return this.sanitizeUser(createdUser);
      }
      
      async findByLogin(UserDTO: LoginDTO): Promise<User> {
        const { email, password } = UserDTO;
        const user = await this.userModel.findOne({ email });
        if (!user) {
          throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }
        if (await bcrypt.compare(password, user.password)) {
          return this.sanitizeUser(user)
        } else {
          throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
        }
      }   
      // the new methods
      async findByPayload(payload: Payload): Promise<User> {
        const { email } = payload;
        return this.userModel.findOne({ email });
      }
   // return user object without password
      sanitizeUser(user: User): User {
        const sanitized = user.toObject() as User;
        delete sanitized['password'];
        return sanitized;
      }

}
