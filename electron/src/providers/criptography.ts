import bcrypt from "bcrypt";

export class Criptography {
  async hash(value: string): Promise<string> {
    const hashValue = await bcrypt.hash(value, 12);
    return hashValue;
  }
  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  }
}

export default new Criptography();
