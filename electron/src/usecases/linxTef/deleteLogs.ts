import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class DeleteLogs implements IUseCaseFactory {
    async execute(): Promise<void> {
        await tefApi.post(`/apaga-logs-tef`)
    }
}
export const deleteLogs = new DeleteLogs();
