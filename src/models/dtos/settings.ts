export interface SettingsDto {
  id: string;
  disabled_balance?: boolean;
  should_remember_user?: boolean;
  rememberd_user?: string;
  balance_port?: string;
  printer?: string;
  created_at?: Date;
}
