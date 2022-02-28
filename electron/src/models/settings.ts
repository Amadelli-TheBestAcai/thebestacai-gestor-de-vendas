import { BaseRepository } from "../repository/baseRepository";
import { v4 } from "uuid";
import Printer from "printer";

export type Entity = {
  id: string;
  should_use_balance?: boolean;
  should_use_printer?: boolean;
  should_remember_user?: boolean;
  rememberd_user?: string;
  balance_port?: string;
  printer?: string;
  created_at?: Date;
};

class ItemOutCart extends BaseRepository<Entity> {
  constructor(storageName = "Settings") {
    super(storageName);
  }

  async getSettings(): Promise<Entity> {
    const _settings = await this.getOne();
    if (_settings) {
      return _settings;
    } else {
      const payload: Entity = { id: v4() };
      await this.create(payload);
      return payload;
    }
  }

  getPrinters(): string[] {
    return Printer.getPrinters().map((printer) => printer.name) || [];
  }
}

export default new ItemOutCart();
