import { NextFunction, Request, Response } from 'express'
import { HTTPError } from './http-error.class'

export interface IExeptionFilter {
	catch: (err: HTTPError | Error, req: Request, res: Response, next: NextFunction) => void
}
