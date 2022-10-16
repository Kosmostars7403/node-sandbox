import { IUserService } from "./interfaces/user.service.interface"
import { UserRegisterDto } from "./dto/user-register.dto"
import { UserLoginDto } from "./dto/user-login.dto"
import { User } from "./user.entity"
import { inject, injectable } from "inversify"
import "reflect-metadata"
import { TYPES } from "../types"
import { IConfigService } from "../config/config.service.interface"
import { IUsersRepository } from "./interfaces/users.repository.interface"
import { UserModel } from "@prisma/client"

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository
  ) {}

  async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name)
    const salt = this.configService.get("SALT")
    await newUser.setPassword(password, Number(salt))

    const existedUser = await this.usersRepository.find(email)

    if (existedUser) {
      return null
    }

    return await this.usersRepository.create(newUser)
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    const existedUser = await this.usersRepository.find(dto.email)

    if (!existedUser) return false

    const user = new User(existedUser.email, existedUser.name, existedUser.password)
    return user.comparePassword(dto.password)
  }
}
