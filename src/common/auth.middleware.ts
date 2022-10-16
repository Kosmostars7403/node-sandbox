import { IMiddleware } from "./middleware.interface"
import { NextFunction, Request, Response } from "express"
import { JwtPayload, verify } from "jsonwebtoken"

export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string) {}

  execute(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (authHeader) {
      verify(authHeader.split(" ")[1], this.secret, (err, payload) => {
        if (err) {
          next()
        } else if (payload) {
          req.user = (payload as JwtPayload).email
          next()
        }
      })
    } else {
      next()
    }
  }
}
