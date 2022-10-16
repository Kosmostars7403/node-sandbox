import express, { Express } from "express"
import { Server } from "http"
import { UsersController } from "./users/users.controller"
import { ExeptionFilter } from "./error/exeption.filter"
import { ILogger } from "./logger/logger.interface"
import { inject, injectable } from "inversify"
import { TYPES } from "./types"
import "reflect-metadata"
import { json } from "body-parser"
import { IUsersController } from "./users/users.interface"
import { IExeptionFilter } from "./error/exeption.filter.interface"
import { IConfigService } from "./config/config.service.interface"

@injectable()
export class App {
  app: Express
  server: Server
  port: number

  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
    @inject(TYPES.UserController) private userController: UsersController,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    this.app = express()
    this.port = 8000
  }

  useMiddleware(): void {
    this.app.use(json())
  }

  useRoutes(): void {
    this.app.use("/users", this.userController.router)
  }

  useExeptionFilters(): void {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter))
  }

  async init(): Promise<void> {
    this.useMiddleware()
    this.useRoutes()
    this.useExeptionFilters()
    this.server = this.app.listen(this.port)
    this.loggerService.log("Сервер запущен!")
  }
}
