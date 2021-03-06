export interface AuditDto {
  audits: Audit[];
  totalElements: number;
}

export interface Audit {
  id: number;
  totalElements: number;
  user: {
    name: string;
  };
  created_at: string;
  old_value: number | string;
  new_value: number | string;
  user_id: number;
  field: string;
}
