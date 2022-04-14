import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant} from 'src/types/user';
import { LoginDTO, RegisterDTO } from './register.dto';
import * as bcrypt from "bcrypt"
import { Payload } from 'src/types/payload';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class RestaurantService {
    constructor(
        @InjectModel('Restaurants') private restaurantsModel: Model<Restaurant>,
        @Inject(CloudinaryService) private readonly cloudinaryService : CloudinaryService
    ){}

    async findAll():Promise<Restaurant[]>{
      return this.restaurantsModel.find({}).exec();
    }

    async findById(id:string):Promise<Restaurant>{
      const user = await this.restaurantsModel.findById(id).exec();
      this.handleUserNotFoundById(user);
      return user;
    }

    async update(id:string, registerDTO:RegisterDTO, file: Express.Multer.File):Promise<Restaurant>{
      const user = await this.restaurantsModel.findById(id).exec();
      let hashed = "";
      const {url} = await this.handleFileUpload(file);
      const selectedLocation = JSON.parse(registerDTO.selectedLocation);
      const document = {...registerDTO, selectedLocation}
      if (registerDTO.password){
        hashed = await bcrypt.hash(user.password , 10);
        document.password = hashed;
      }
      const updated = await this.restaurantsModel.findByIdAndUpdate(id,{...document,image:{url}},{new:true}).exec()      
      this.handleUserNotFoundById(user);
      return updated;
    }
  
    async create(registerDTO: RegisterDTO, file: Express.Multer.File):Promise<Restaurant> {
        const { email } = registerDTO;
        const {url} = await this.handleFileUpload(file);
        const user = await this.restaurantsModel.findOne({ email });
        if (user) {
          throw new HttpException('El email registrado ya se encuentra en uso', HttpStatus.BAD_REQUEST);
        } 
        const selectedLocation = JSON.parse(registerDTO.selectedLocation);
        const document = {...registerDTO, selectedLocation}
        const createdUser = new this.restaurantsModel({...document, image:{url}});
        await createdUser.save();
        return this.sanitizeUser(createdUser);
      }
      
      async findByLogin(UserDTO: LoginDTO): Promise<Restaurant> {
        const { email, password } = UserDTO;
        const user = await this.restaurantsModel.findOne({ email });
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
      async findByPayload(payload: Payload): Promise<Restaurant> {
        const { email } = payload;
        return this.restaurantsModel.findOne({ email });
      }

      async delete(id: string):Promise<boolean>{
        return this.restaurantsModel.findByIdAndDelete(id);
      }

      handleFileUpload(file: Express.Multer.File){
        try {
          return this.cloudinaryService.uploadImage(file);
        } catch (error) {
          console.log("🚀 ~ file: Restaurants.service.ts ~ line 81 ~ RestaurantService", error)
        }
      }


   // return user object without password
      sanitizeUser(user: Restaurant): Restaurant {
        const sanitized = user.toObject() as Restaurant;
        delete sanitized['password'];
        return sanitized;
      }

      handleUserNotFoundById(user:Restaurant){
        if(!user){
          throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }
      }

}
