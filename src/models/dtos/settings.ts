export interface SettingsDto {
  id: string;
  should_emit_nfce_per_sale?: boolean;
  should_print_sale?: boolean;
  should_use_balance?: boolean;
  should_use_printer?: boolean;
  should_remember_user?: boolean;
  should_open_casher?: boolean;
  rememberd_user?: string;
  balance_port?: string;
  printer?: string;
  created_at?: Date;
}
