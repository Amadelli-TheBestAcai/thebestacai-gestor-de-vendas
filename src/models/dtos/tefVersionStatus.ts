export type TefVersionStatus = {
  isRequired: boolean;
  currentVersion: string | null;
  requiredVersion: string;
  downloadUrl: string;
  message: string;
};
