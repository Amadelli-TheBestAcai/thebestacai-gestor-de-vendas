export interface CheckServerTefUpdateDto {
  needsUpdate: boolean;
  currentVersion: string | null;
  requiredVersion: string;
  downloadUrl: string;
  message: string;
}
