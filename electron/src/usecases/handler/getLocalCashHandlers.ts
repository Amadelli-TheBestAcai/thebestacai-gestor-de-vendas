import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";

import { HandlerDto } from "../../models/gestor";

class GetLocalCashHandlers implements IUseCaseFactory {
  constructor(
    private cashHandlerRepository = new BaseRepository<HandlerDto>(
      StorageNames.Integrated_Handler
    )
  ) { }

  async execute(): Promise<HandlerDto[]> {
    return await this.cashHandlerRepository.getAll();
  }
}

export const getLocalCashHandlers = new GetLocalCashHandlers();
