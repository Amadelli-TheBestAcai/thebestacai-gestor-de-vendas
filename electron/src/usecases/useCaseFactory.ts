import { BaseRepository } from "../repository/baseRepository";
import { StorageNames } from "../repository/storageNames";
import { IUseCaseFactory } from "./useCaseFactory.interface";
import { ErrorDto } from "../models/dtos/error";
import { UseCaseFactoryResponse } from "./useCaseFactoryResponse.interface";

class UseCaseFactory {
  constructor(
    private errorsRepository = new BaseRepository<ErrorDto>(StorageNames.Errors)
  ) {}

  async execute<T>(
    useCase: IUseCaseFactory,
    params?: any
  ): Promise<UseCaseFactoryResponse<T>> {
    try {
      const response = await useCase.execute(params);
      return {
        response,
        has_internal_error: false,
      };
    } catch (error: any) {
      await this.errorsRepository.create({
        useCase: useCase.constructor.name,
        error: {
          message: error.message,
          trace: JSON.stringify(error.stack),
        },
      });
      return {
        response: undefined,
        has_internal_error: true,
      };
    }
  }
}

export const useCaseFactory = new UseCaseFactory();
