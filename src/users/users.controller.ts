import { NextFunction, Request, Response } from "express"
import { BaseController } from "../common/base.controller"
import { HTTPError } from "../error/http-error.class"
import { inject, injectable } from "inversify"
import { TYPES } from "../types"
import { ILogger } from "../logger/logger.interface"
import "reflect-metadata"
import { IUsersController } from "./interfaces/users.interface"
import { UserLoginDto } from "./dto/user-login.dto"
import { UserRegisterDto } from "./dto/user-register.dto"
import { IUserService } from "./interfaces/user.service.interface"
import { ValidateMiddleware } from "../common/validate.middleware"
import { sign } from "jsonwebtoken"
import { IConfigService } from "../config/config.service.interface"

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    super(loggerService)

    this.bindRoutes([
      {
        path: "/register",
        method: "post",
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        path: "/login",
        method: "post",
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        path: "/info",
        method: "get",
        func: this.info,
        middlewares: [],
      },
    ])
  }

  async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.userService.validateUser(body)

    if (!result) return next(new HTTPError(401, "Wrong credentials", "login"))
    const secret = this.configService.get("SECRET")
    const jwt = await this.signJWT(body.email, secret)
    this.ok(res, { jwt })
  }

  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.userService.createUser(body)
    if (!result) {
      return next(new HTTPError(422, "User with email already exists"))
    }
    this.ok(res, { email: result.email, id: result.id })
  }

  async info({ user }: Request, res: Response, next: NextFunction) {
    this.ok(res, { email: user })
  }

  private signJWT(email: string, secret: string) {
    return new Promise<string>((res, rej) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        { algorithm: "HS256" },
        (err, token) => {
          if (err) rej(err)
          res(token as string)
        }
      )
    })
  }
}
