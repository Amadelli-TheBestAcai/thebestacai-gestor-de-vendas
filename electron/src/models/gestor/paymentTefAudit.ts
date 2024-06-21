export interface PaymentTefAuditDto {
    id?: string,
    field: string,
    old_value: string
    new_value: string;
    user_id?: number;
    user_name?: string;
    ref: number;
    type: number;
    justify?: string
    code_nsu?: string
}