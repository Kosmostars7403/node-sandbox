import { NextFunction, Request, Response } from 'express'
import { BaseController } from '../common/base.controller'
import { HTTPError } from '../error/http-error.class'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'
import 'reflect-metadata'
import { IUsersController } from './users.interface'

class User {}
const users = []

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService)

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register
			},
			{
				path: '/login',
				method: 'post',
				func: this.login
			}
		])
	}

	register(req: Request, res: Response, next: NextFunction): void {
		users.push(new User())
		this.ok(res, 'login')
	}

	login(req: Request, res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'error from login'))
	}
}
