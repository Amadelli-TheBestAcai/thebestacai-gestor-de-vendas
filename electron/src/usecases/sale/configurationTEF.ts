import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";
class ConfigurationTEF implements IUseCaseFactory {
    async execute(): Promise<void> {
        await tefApi.get(`/configura-dpos`)
    }
}
export const configurationTEF = new ConfigurationTEF();
