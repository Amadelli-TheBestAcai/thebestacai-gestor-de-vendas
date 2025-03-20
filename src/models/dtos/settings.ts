export interface SettingsDto {
  id: string;
  should_print_nfce_per_sale?: boolean;
  should_emit_nfce_per_sale?: boolean;
  should_print_sale?: boolean;
  should_use_balance?: boolean;
  should_use_printer?: boolean;
  should_remember_user?: boolean;
  should_open_casher?: boolean;
  rememberd_user?: string;
  balance_port?: string;
  printer?: string;
  should_use_tef?: boolean
  created_at?: Date;
  cnpj_credenciadora?: string;
  should_active_discount_storekeeper?: boolean
}
