export interface UseCaseFactoryResponse<T> {
  response?: T;
  has_internal_error: boolean;
}
