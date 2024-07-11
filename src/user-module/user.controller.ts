// user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { IUser } from 'src/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'Create a user' })
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @HttpCode(202)
  @ApiAcceptedResponse({ description: 'Update a user' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    updateUserDto.id = id;
    this.userService.update(updateUserDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ description: 'Get all users' })
  async getUsers(): Promise<IUser[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Query user by Id' })
  async getUser(@Param('id') id: string): Promise<IUser> {
    return this.userService.getUser(id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Delete user by Id' })
  async deleteUser(@Param('id') id: string): Promise<IUser> {
    return this.userService.deleteUser(id);
  }
}
