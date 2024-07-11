import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserService } from '../src/user-module/user.service';
import { IUser, EGender } from '../src/common';
import { UserModule } from '../src/user-module/user.module';
import { CreateUserDto, UpdateUserDto } from '../src/user-module/dto';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../src/user-module/schema/user.schema';
import { mock } from 'ts-jest-mocker';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const userService = mock(UserService);

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        MongooseModule.forRoot(process.env.DATABASE_URI),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST users', () => {
    const createUserDto: CreateUserDto = {
      userName: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gender: EGender.MALE,
      userAddress: {
        country: 'Thailand',
        city: 'Bangkok',
      },
    };
    const result: IUser = { id: '1', joinedDate: null, ...createUserDto };

    userService.create.mockResolvedValue(result);

    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201)
      .expect(result);
  });

  it('/PUT users/:id', () => {
    const updateUserDto: UpdateUserDto = {
      id: '1',
      userName: 'john_updated',
      firstName: 'John',
      lastName: 'Dane',
      email: 'john.dane@example.com',
      gender: EGender.MALE,
      userAddress: {
        country: 'Thailand',
        city: 'Bangkok',
      },
    };
    const result: IUser = {
      id: '1',
      joinedDate: null,
      userName: updateUserDto.userName!,
      firstName: updateUserDto.firstName!,
      lastName: updateUserDto.lastName!,
      email: updateUserDto.email!,
      gender: updateUserDto.gender!,
      userAddress: updateUserDto.userAddress!,
    };

    userService.update.mockResolvedValue(result);

    return request(app.getHttpServer())
      .put('/users/1')
      .send(updateUserDto)
      .expect(202);
  });

  it('/GET users', () => {
    const result: IUser[] = [
      {
        id: '1',
        userName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        gender: EGender.MALE,
        userAddress: { country: 'USA', city: 'New York' },
        joinedDate: null,
      },
    ];

    userService.getUsers.mockResolvedValue(result);

    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(result);
  });

  it('/GET users/:id', () => {
    const result: IUser = {
      id: '1',
      userName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gender: EGender.MALE,
      userAddress: { country: 'USA', city: 'New York' },
      joinedDate: null,
    };

    userService.getUser.mockResolvedValue(result);

    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect(result);
  });

  it('/DELETE users/:id', () => {
    const result: IUser = {
      id: '1',
      userName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gender: EGender.MALE,
      userAddress: { country: 'USA', city: 'New York' },
      joinedDate: null,
    };

    userService.deleteUser.mockResolvedValue(result);

    return request(app.getHttpServer()).delete('/users/1').expect(204);
  });
});
