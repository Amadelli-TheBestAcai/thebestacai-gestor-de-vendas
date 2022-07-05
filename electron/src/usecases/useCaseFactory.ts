import { BaseRepository } from "../repository/baseRepository";
import { StorageNames } from "../repository/storageNames";
import { IUseCaseFactory } from "./useCaseFactory.interface";
import { ErrorDto } from "../models/dtos/error";
import { appInsights } from "../providers/appInsights";
import { UseCaseFactoryResponse } from "./useCaseFactoryResponse.interface";

class UseCaseFactory {
  constructor(
    private errorsRepository = new BaseRepository<ErrorDto>(StorageNames.Errors)
  ) { }

  async execute<T>(
    useCase: IUseCaseFactory,
    params?: any
  ): Promise<UseCaseFactoryResponse<T>> {
    // appInsights.start();
    try {
      const response = await useCase.execute(params);
      // await appInsights.finish(useCase.constructor.name, {
      //   success: true,
      //   params,
      // });
      return {
        response,
        has_internal_error: false,
      };
    } catch (error: any) {
      let error_message = error.message;
      if (error?.response) {
        if (error?.response?.data?.message) {
          error_message = error?.response?.data?.message;
        }
      }

      // await this.errorsRepository.create({
      //   useCase: useCase.constructor.name,
      //   error: {
      //     error_message,
      //     trace: JSON.stringify(error.stack),
      //   },
      // });

      // await appInsights.finish(useCase.constructor.name, {
      //   error_message,
      //   success: false,
      //   error,
      // });
      return {
        response: undefined,
        has_internal_error: true,
        error_message,
      };
    }
  }
}

export const useCaseFactory = new UseCaseFactory();
