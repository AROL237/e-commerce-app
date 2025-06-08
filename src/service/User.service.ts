import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDtoRequest } from 'src/dtos/user/UserDtoRequest';
import { User } from 'src/entities/User.entity';
import { UserServiceInterface } from 'src/interface/User.interface';
import { PrismaService } from './prisma/prisma.service';
import { Role, User as PrismaUser } from '@prisma/client';
import { UserDetailInterface } from 'src/security/UserDetail.inteface';
import { UserNotFoundException } from 'src/Exceptions/UserNotFound.exception';
import { encode, match } from 'src/utils/PasswordEncoder.util';

@Injectable()
export class UserService implements UserServiceInterface, UserDetailInterface {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @param email @type string
   * @returns @type Promise<PrismaUser>
   */
  async loadUserDetail(email: string): Promise<PrismaUser> {
    // const user = await this.findByEmail(email);
    return (await this.prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    })) as any;
  }
  async findByEmail(email: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
      omit: {
        password: true,
      },
    });
  }

  /**
   *
   * @param userDto @typedef UserDtoRequest
   * @returns @typedef User
   */
  async createUser(userDto: UserDtoRequest): Promise<User> {
    let exist_user = this.findByEmail(userDto.email);

    if ((await exist_user) instanceof User) {
      throw new ConflictException(
        `User email: ${userDto.email} already exist.`,
      );
    } else {
      //save user if not exist
      let data = {
        email: userDto.email.trim().toLowerCase(),
        first_name: userDto.first_name.trim().toUpperCase(),
        last_name: userDto.last_name ? userDto.last_name : '',
        password: await encode(userDto.password),
        role: Role.USER,
        is_active: true,
      };
      let newUser: any;
      await this.prisma.user
        .create({ data })
        .then((value) => (newUser = value));

      const result = User.prototype.convertToEntity(newUser);

      return result;
    }
  }

  findAll() {}

  async findOne(id: number): Promise<User | null> {
    // Here you would typically fetch the user from the database using the id

    let user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (user != null) return User.prototype.convertToEntity(user);
    else return null;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async createAdmin(adminDto: UserDtoRequest): Promise<User> {
    // update user to admin role or add admin role to user.
    const email: string = adminDto.email.trim().toLowerCase();
    let user = await this.findByEmail(email);
    if (user) {
      throw new ConflictException(`User with email: ${email} already exist.`);
    } else {
      //create new user as admin
      let data = {
        email: adminDto.email.trim().toLowerCase(),
        first_name: adminDto.first_name.trim().toUpperCase(),
        last_name: adminDto.last_name ? adminDto.last_name : '',
        password: await encode(adminDto.password),
        role: Role.ADMIN,
        is_active: true,
        access_code: await this.generatePIN(),
      };
      let newUser = await this.prisma.user.create({ data: data });
      return User.prototype.convertToEntity(newUser);
    }
  }

  //function to generate a random access code
  async generatePIN(): Promise<string> {
    const symbols = '@#';
    const prefix = Math.floor(Math.ceil(Math.random() * 2));
    const num = Math.floor((Math.random() + 1) * 1001);
    return `${symbols}+${num}`;
  }
}
