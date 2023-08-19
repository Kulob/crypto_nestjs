import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { AppController } from 'src/app.controller';
import { AppError } from 'src/common/errors';
import { AuthUserResponse } from '../auth/response';
import { Watchlist } from '../watchlist/models/watchlist.module';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      dto.password = await this.hashPassword(dto.password);

      await this.userRepository.create({
        firstName: dto.firstName,
        username: dto.username,
        email: dto.email,
        password: dto.password,
      });
      return dto;
    } catch (e) {
      throw new Error(e);
    }
  }

//   async publicUser (email: string): Promise<AuthUserResponse>{
//     try {
//       const user = await this.userRepository.findOne({
//         where: {email},
//         attributes: {exclude: ['password']},
//         include: {
//           model: Watchlist,
//           required: false
//         }
//       })
//       const token = await this.tokenService.generateJwtToken(user)
//       return { user, token}
//     }catch (e) {
//       throw new Error(e)
//     }
//   }

async publicUser (email: string) {
  return await this.userRepository.findOne({
    where: {email},
    attributes: {exclude: ['password']},
    include: {
      model: Watchlist,
      required: false
    }
  })
}

  async updateUser (email: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    await this.userRepository.update(dto, {where: {email}})
    return dto
  }

  async deleteUser (email: string): Promise<boolean> {
    await this.userRepository.destroy({where: {email}})
    return true
  }
}
