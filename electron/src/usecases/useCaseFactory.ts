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
      console.log(error);
      let error_message = error.message;
      if (error?.response) {
        if (error?.response?.data?.message) {
          error_message = error?.response?.data?.message;
        }
      }
      return {
        response: undefined,
        has_internal_error: true,
        error_message,
      };
    }
  }
}

export const useCaseFactory = new UseCaseFactory();
