import { inject, injectable } from "inversify"
import { PrismaClient, UserModel } from "@prisma/client"
import "reflect-metadata"
import { TYPES } from "../types"
import { ILogger } from "../logger/logger.interface"

@injectable()
export class PrismaService {
  client: PrismaClient

  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    this.client = new PrismaClient()
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect()
      this.loggerService.log("[PrismaService] Established connection with db")
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.error(`[PrismaService] Error with db connection: ${e.message}`)
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect()
  }
}
