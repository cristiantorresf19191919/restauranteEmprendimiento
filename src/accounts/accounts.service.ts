import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Account} from 'src/types/user';
import { LoginDTO, RegisterDTO } from './register.dto';
import * as bcrypt from "bcrypt"
import { Payload } from 'src/types/payload';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class AccountService {
    constructor(
        @InjectModel('Accounts') private accountsModel: Model<Account>,
        @Inject(CloudinaryService) private readonly cloudinaryService : CloudinaryService
    ){}

    async findAll():Promise<Account[]>{
      return this.accountsModel.find({}).exec();
    }

    async findById(id:string):Promise<Account>{
      const user = await this.accountsModel.findById(id).exec();
      this.handleUserNotFoundById(user);
      return user;
    }

    async update(id:string, registerDTO:RegisterDTO, file: Express.Multer.File):Promise<Account>{
      const user = await this.accountsModel.findById(id).exec();
      let hashed = "";
      const {url} = await this.handleFileUpload(file);
      const selectedLocation = JSON.parse(registerDTO.selectedLocation);
      const document = {...registerDTO, selectedLocation}
      if (registerDTO.password){
        hashed = await bcrypt.hash(user.password , 10);
        document.password = hashed;
      }
      const updated = await this.accountsModel.findByIdAndUpdate(id,{...document,imageUrl:url},{new:true}).exec()      
      this.handleUserNotFoundById(user);
      return updated;
    }
  
    async create(registerDTO: RegisterDTO, file: Express.Multer.File):Promise<Account> {
        const { email } = registerDTO;
        const {url} = await this.handleFileUpload(file);
        const user = await this.accountsModel.findOne({ email });
        if (user) {
          throw new HttpException('El email registrado ya se encuentra en uso', HttpStatus.BAD_REQUEST);
        } 
        const selectedLocation = JSON.parse(registerDTO.selectedLocation);
        const document = {...registerDTO, selectedLocation}
        const createdUser = new this.accountsModel({...document, imageUrl:url});
        await createdUser.save();
        return this.sanitizeUser(createdUser);
      }
      
      async findByLogin(UserDTO: LoginDTO): Promise<Account> {
        const { email, password } = UserDTO;
        const user = await this.accountsModel.findOne({ email });
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
      async findByPayload(payload: Payload): Promise<Account> {
        const { email } = payload;
        return this.accountsModel.findOne({ email });
      }

      async delete(id: string):Promise<boolean>{
        return this.accountsModel.findByIdAndDelete(id);
      }

      handleFileUpload(file: Express.Multer.File){
        try {
          return this.cloudinaryService.uploadImage(file);
        } catch (error) {
          console.log("🚀 ~ file: accounts.service.ts ~ line 81 ~ AccountService ~ handleFileUpload ~ error", error)
        }
      }


   // return user object without password
      sanitizeUser(user: Account): Account {
        const sanitized = user.toObject() as Account;
        delete sanitized['password'];
        return sanitized;
      }

      handleUserNotFoundById(user:Account){
        if(!user){
          throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
        }
      }

}
