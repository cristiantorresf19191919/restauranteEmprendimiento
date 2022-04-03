import { Controller, Get, HttpStatus, Res, Param, Put, Body } from '@nestjs/common';
import { Account } from 'src/types/user';
import { RegisterDTO } from './register.dto';
import { AccountService } from './accounts.service';

@Controller('accounts')
export class UserController {
    constructor(
        private userService: AccountService
    ){}
    sendResponse<Status, Body>(status:Status, body:Body, @Res() response):Promise<Body>{
        return response.status(status).json(body);
    }
    @Get()
    async findAll(@Res() response):Promise<Array<Account>>{
        const userList:Array<Account> = await this.userService.findAll();
        return this.sendResponse(HttpStatus.OK,userList,response);        
    }

    @Get('/:id')
    async findById(@Res() response, @Param('id') id):Promise<Account>{
        const user = await this.userService.findById(id)
        if (!user) return this.sendResponse(HttpStatus.BAD_REQUEST,user,response);
        return this.sendResponse(HttpStatus.OK,user,response);
    }
    @Put('/:id')
    async update(@Res() response, @Param('id') id, @Body() user:RegisterDTO){
        const updatedUser = await this.userService.update(id,user);
        return this.sendResponse(HttpStatus.OK, updatedUser, response);
    }
}
