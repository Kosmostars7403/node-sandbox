import { NextFunction, Response, Request } from 'express'

export interface IUsersController {
	register: (req: Request, res: Response, next: NextFunction) => void
	login: (req: Request, res: Response, next: NextFunction) => void
}
