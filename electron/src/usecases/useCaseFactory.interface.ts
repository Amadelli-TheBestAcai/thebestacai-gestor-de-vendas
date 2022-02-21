export interface IUseCaseFactory {
  execute(params?: any): Promise<any>;
}
