import { App } from './app'
import { LoggerService } from './logger/logger.service'
import { Container, ContainerModule, interfaces } from 'inversify'
import { ILogger } from './logger/logger.interface'
import { TYPES } from './types'
import { ExeptionFilter } from './error/exeption.filter'
import { UsersController } from './users/users.controller'
import { IExeptionFilter } from './error/exeption.filter.interface'
import { IUsersController } from './users/users.interface'

export interface IBootstrapReturn {
	appContainer: Container
	app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService)
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter)
	bind<IUsersController>(TYPES.UserController).to(UsersController)
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