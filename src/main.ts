import { App } from "./app"
import { LoggerService } from "./logger/logger.service"
import { Container, ContainerModule, interfaces } from "inversify"
import { ILogger } from "./logger/logger.interface"
import { TYPES } from "./types"
import { ExeptionFilter } from "./error/exeption.filter"
import { UsersController } from "./users/users.controller"
import { IExeptionFilter } from "./error/exeption.filter.interface"
import { IUsersController } from "./users/interfaces/users.interface"
import { IUserService } from "./users/interfaces/user.service.interface"
import { UserService } from "./users/user.service"
import { IConfigService } from "./config/config.service.interface"
import { ConfigService } from "./config/config.service"
import { PrismaService } from "./database/prisma.service"
import { IUsersRepository } from "./users/interfaces/users.repository.interface"
import { UsersRepository } from "./users/users.repository"

export interface IBootstrapReturn {
  appContainer: Container
  app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
  bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope()
  bind<IUsersController>(TYPES.UserController).to(UsersController).inSingletonScope()
  bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope()
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope()
  bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope()
  bind<App>(TYPES.Application).to(App)
})

function bootstrap(): IBootstrapReturn {
  const appContainer = new Container()
  appContainer.load(appBindings)
  const app = appContainer.get<App>(TYPES.Application)
  app.init()
  return { appContainer, app }
}

export const { appContainer, app } = bootstrap()
