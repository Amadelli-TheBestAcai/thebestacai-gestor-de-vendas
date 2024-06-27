import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { getCurrentStoreCash } from "../storeCash";
import { StoreCashDto, StoreDto } from "../../models/gestor";
import { PaymentTefAuditDto } from "../../models/gestor/paymentTefAudit";
import api from "../../providers/odinApi";


class IntegrationPaymentTefAudit implements IUseCaseFactory {
  constructor(
    private paymentTefAuditRepository = new BaseRepository<PaymentTefAuditDto>(
      StorageNames.Payment_Tef_Audit
    ),
    private notIntegratedPaymentTefAuditRepository = new BaseRepository<PaymentTefAuditDto>(
      StorageNames.Not_Integrated_Payment_Tef_Audit
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private getCurrentStoreCashUseCase = getCurrentStoreCash
  ) { }

  async execute(): Promise<void> {
    const hasInternet = await checkInternet();
    const store = await this.storeRepository.getOne();

    const { response: storeCash, has_internal_error: errorOnStoreCash } =
      await useCaseFactory.execute<StoreCashDto | undefined>(
        this.getCurrentStoreCashUseCase
      );

    if (errorOnStoreCash) {
      throw new Error("Falha ao obter caixa atual");
    }

    if (!hasInternet || !storeCash || !store || !storeCash.is_online) {
      return;
    }

    const paymentsAudit = await this.notIntegratedPaymentTefAuditRepository.getAll();
    if (paymentsAudit.length) {
      await Promise.all(
        paymentsAudit.map(async (item) => {
          try {
            const veriFyRef = item.ref ? item.ref : storeCash.history_id
            await api.post(`/cash_history_audit/${item.type}`, {
              field: item.field,
              old_value: item.old_value,
              new_value: item.new_value,
              ref: veriFyRef,
              type: item.type,
              justify: item.justify,
              code_nsu: item.code_nsu,
              value: item.value
            });
            await this.paymentTefAuditRepository.create(item);
            await this.notIntegratedPaymentTefAuditRepository.deleteById(item.id as string);
          } catch (error) {
            console.log(error);
          }
        })
      );
    }
  }
}

export const integrationPaymentTefAudit = new IntegrationPaymentTefAudit();
