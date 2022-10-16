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

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService
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
    ])
  }

  async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.userService.validateUser(body)

    if (!result) return next(new HTTPError(401, "Wrong credentials", "login"))
    this.ok(res, { email: body.email })
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
}
