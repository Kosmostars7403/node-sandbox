import { LoggerService } from "../logger/logger.service"
import { Router, Response } from "express"
import { IControllerRoute } from "./route.interface"
import { ILogger } from "../logger/logger.interface"
import { injectable } from "inversify"
import "reflect-metadata"

@injectable()
export abstract class BaseController {
  private readonly _router: Router

  constructor(private logger: ILogger) {
    this._router = Router()
  }

  get router(): Router {
    return this._router
  }

  created(res: Response) {
    return res.sendStatus(201)
  }

  send<T>(res: Response, code: number, message: T) {
    res.type("application/json")
    return res.status(code).json(message)
  }

  ok<T>(res: Response, message: T) {
    return this.send(res, 200, message)
  }

  protected bindRoutes(routes: IControllerRoute[]) {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`)
      this.router[route.method](route.path, route.func.bind(this))
    }
  }
}
