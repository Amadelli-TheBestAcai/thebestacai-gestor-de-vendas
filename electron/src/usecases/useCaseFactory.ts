
import { BaseRepository } from "../repository/baseRepository";
import { StorageNames } from "../repository/storageNames";
import { IUseCaseFactory } from "./useCaseFactory.interface";
import { ErrorDto } from "../models/dtos/error";
import { elasticApm } from "../providers/elasticApm";
import { UseCaseFactoryResponse } from "./useCaseFactoryResponse.interface";

class UseCaseFactory {
  constructor(
    private errorsRepository = new BaseRepository<ErrorDto>(StorageNames.Errors)
  ) { }

  async execute<T>(
    useCase: IUseCaseFactory,
    params?: any
  ): Promise<UseCaseFactoryResponse<T>> {
    elasticApm.start()
    try {
      const response = await useCase.execute(params);
      elasticApm.finish({
        useCase: useCase.constructor.name,
        success: true,
        params
      })
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
      elasticApm.finish({
        useCase: useCase.constructor.name,
        error_message: error.message,
        success: false,
        error
      })
      return {
        response: undefined,
        has_internal_error: true,
      };
    }
  }
}

export const useCaseFactory = new UseCaseFactory();
