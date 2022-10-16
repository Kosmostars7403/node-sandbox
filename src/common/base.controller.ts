import { LoggerService } from "../logger/logger.service"
import { Router, Response } from "express"
import { IControllerRoute } from "./route.interface"
import { ILogger } from "../logger/logger.interface"
import { injectable } from "inversify"
import "reflect-metadata"
import { hash } from "bcryptjs"

@injectable()
export abstract class BaseController {
  private readonly _router: Router

  constructor(private logger: ILogger) {
    this._router = Router()
  }

  get router(): Router {
    return this._router
  }

  created(res: Response): Response<any, Record<string, any>> {
    return res.sendStatus(201)
  }

  send<T>(res: Response, code: number, message: T): Response<any, Record<string, any>> {
    res.type("application/json")
    return res.status(code).json(message)
  }

  ok<T>(res: Response, message: T): Response<any, Record<string, any>> {
    return this.send(res, 200, message)
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`)
      const middleware = route.middlewares?.map((m) => m.execute.bind(m))
      const handler = route.func.bind(this)
      const pipeline = middleware ? [...middleware, handler] : handler
      this.router[route.method](route.path, pipeline)
    }
  }
}
