import { IUseCaseFactory } from "./useCaseFactory.interface";
import { UseCaseFactoryResponse } from "./useCaseFactoryResponse.interface";

class UseCaseFactory {
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
