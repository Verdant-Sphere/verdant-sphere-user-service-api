import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { IUser } from 'src/common';
import { EGender } from '../common';
import { mock } from 'ts-jest-mocker';

describe('UserController', () => {
  let userController: UserController;
  const mockUserService = mock(UserService);

  beforeEach(async () => {
    userController = new UserController(mockUserService);
  });

  it('should create a user', async () => {
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

    mockUserService.create.mockResolvedValue(result);

    expect(await userController.create(createUserDto)).toBe(result);
    expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should update a user', async () => {
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

    mockUserService.update.mockResolvedValue(result);

    expect(await userController.update('1', updateUserDto)).toBe(result);
    expect(mockUserService.update).toHaveBeenCalledWith(updateUserDto);
  });

  it('should get all users', async () => {
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

    mockUserService.getUsers.mockResolvedValue(result);

    expect(await userController.getUsers()).toBe(result);
    expect(mockUserService.getUsers).toHaveBeenCalled();
  });

  it('should get a user by id', async () => {
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

    mockUserService.getUser.mockResolvedValue(result);

    expect(await userController.getUser('1')).toBe(result);
    expect(mockUserService.getUser).toHaveBeenCalledWith('1');
  });

  it('should delete a user by id', async () => {
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

    mockUserService.deleteUser.mockResolvedValue(result);

    expect(await userController.deleteUser('1')).toBe(result);
    expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
  });
});
