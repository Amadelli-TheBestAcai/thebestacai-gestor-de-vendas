import { v4 } from "uuid";
import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { PaymentTefAuditDto } from "../../models/gestor/paymentTefAudit";
import { PaymentType } from "../../models/enums/paymentType";
import { PaymentTefCancelType } from "../../models/enums/PaymentTefCancelType";
import { integrationPaymentTefAudit } from "./integrationPaymentTEFAUdit";

interface Request {
  type: PaymentType;
  payment_tef_cancel_type: PaymentTefCancelType;
  sale_id: number,
  justify: string,
  code_nsu: string
}

class InsertPaymentTefAudit implements IUseCaseFactory {
  constructor(
    private paymentTefAuditRepository = new BaseRepository<PaymentTefAuditDto>(
      StorageNames.Payment_Tef_Audit
    ),
    private notIntegratedPaymentTefAuditRepository = new BaseRepository<PaymentTefAuditDto>(
      StorageNames.Not_Integrated_Payment_Tef_Audit
    ),
    private integrationPaymentTefAuditUseCase = integrationPaymentTefAudit
  ) { }

  async execute({ type, payment_tef_cancel_type, sale_id, justify, code_nsu }: Request): Promise<PaymentTefAuditDto> {
    const newPaymentAudit: PaymentTefAuditDto = {
      id: v4(),
      field: PaymentType[type],
      old_value: 'Aprovado',
      new_value: payment_tef_cancel_type === PaymentTefCancelType.DESFEITO ? "Desfeito" : "Cancelado",
      ref: sale_id,
      type: 4,
      justify,
      code_nsu
    };

    await this.paymentTefAuditRepository.create(newPaymentAudit);

    await this.notIntegratedPaymentTefAuditRepository.create(newPaymentAudit);

    await useCaseFactory.execute<void>(this.integrationPaymentTefAuditUseCase);

    return newPaymentAudit;
  }
}

export const insertPaymentTefAudit = new InsertPaymentTefAudit();
