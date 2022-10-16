import { NextFunction, Request, Response } from 'express'
import { IExeptionFilter } from './exeption.filter.interface'
import { HTTPError } from './http-error.class'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'
import 'reflect-metadata'

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: HTTPError | Error, req: Request, res: Response, next: NextFunction) {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] ERROR ${err.message}`)
			res.status(err.statusCode).send({ err: err.message })
		}
		res.status(500).send({ err: err.message })
	}
}
