import { Body, Controller, Get, Post, UploadedFile, Put, UseInterceptors, Res, Param, HttpStatus } from '@nestjs/common';
import { Account } from 'src/types/user';
import { RegisterDTO } from './register.dto';
import { AccountService } from './accounts.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('accounts')
export class UserController {
    constructor(
        private accountService: AccountService
    ){}
    sendResponse<Status, Body>(status:Status, body:Body, @Res() response):Promise<Body>{
        return response.status(status).json(body);
    }
    @Get()
    async findAll(@Res() response):Promise<Array<Account>>{
        const userList:Array<Account> = await this.accountService.findAll();
        return this.sendResponse(HttpStatus.OK,userList,response);        
    }

    @Get('/:id')
    async findById(@Res() response, @Param('id') id):Promise<Account>{
        const user = await this.accountService.findById(id)
        if (!user) return this.sendResponse(HttpStatus.BAD_REQUEST,user,response);
        return this.sendResponse(HttpStatus.OK,user,response);
    }
    @Put('/:id')
    async update(@Res() response, @Param('id') id, @Body() user:RegisterDTO){
        const updatedUser = await this.accountService.update(id,user);
        return this.sendResponse(HttpStatus.OK, updatedUser, response);
    }
    
    @Post('uploadPicture')    
    @UseInterceptors(FileInterceptor('file'))
    async uploadPicture(@UploadedFile() file: Express.Multer.File){
        return this.accountService.handleFileUpload(file);
        
    }
}
