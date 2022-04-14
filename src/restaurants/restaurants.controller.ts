import { Body, Controller, Get, Post, UploadedFile, Put, UseInterceptors, Res, Param, HttpStatus, Delete } from '@nestjs/common';
import { Restaurant } from 'src/types/user';
import { RegisterDTO } from './register.dto';
import { RestaurantService } from './restaurants.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('restaurants')
export class RestaurantController {
    constructor(private restaurantService: RestaurantService) { }
    sendResponse<Status, Body>(
        status: Status,
        body: Body,
        @Res() response,
    ): Promise<Body> {
        return response.status(status).json(body);
    }
    @Get()
    async findAll(@Res() response): Promise<Array<Restaurant>> {
        const userList: Array<Restaurant> = await this.restaurantService.findAll();
        return this.sendResponse(HttpStatus.OK, userList, response);
    }

    @Get('/:id')
    async findById(@Res() response, @Param('id') id): Promise<Restaurant> {
        const user = await this.restaurantService.findById(id);
        if (!user) return this.sendResponse(HttpStatus.BAD_REQUEST, user, response);
        return this.sendResponse(HttpStatus.OK, user, response);
    }
    @Delete('/:id')
    async delete(@Param('id') id) {
        const res = await this.restaurantService.delete(id);
        if (res) return {msg:"Cuenta Eliminada"}
        return {msg:"Error en la peticion"}
    }
    @Put('/:id')
    @UseInterceptors(FileInterceptor('image'))
    async update(@Res() response, @Param('id') id, @Body() body: RegisterDTO, @UploadedFile() file: Express.Multer.File) {
        const updatedUser = await this.restaurantService.update(id, body, file);
        return this.sendResponse(HttpStatus.OK, updatedUser, response);
    }

    @Post('uploadPicture')
    @UseInterceptors(FileInterceptor('file'))
    async uploadPicture(@UploadedFile() file: Express.Multer.File) {
        return this.restaurantService.handleFileUpload(file);
    }
}
