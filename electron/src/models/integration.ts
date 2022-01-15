import cron from "node-cron";
import database from "../../src/providers/database";
import midasApi from "../providers/midasApi";
import { salesFormaterToIntegrate } from "../helpers/salesFormaterToIntegrate";
import { Entity } from "../models/sale";

const SALE_STORAGE = "Sale";
const PRE_INTEGRATED_STORAGE = "Pre_Integrated_Sale";
const INTEGRATED_STORAGE = "Integrated_Sale";

export class Integration {
  private is_integrating: boolean = false;
  constructor() {
    cron.schedule("* * * * *", async () => {
      if (this.is_integrating) {
        return;
      }
      await this.onlineIntegration();
    });
  }

  async moveToPreIntegration(): Promise<void> {
    if (this.is_integrating) {
      return;
    }
    const con = database.getConnection();
    const sales: Entity[] = (await con.getItem(SALE_STORAGE)) || [];
    const salesToIntegrate: Entity[] = sales.filter(
      (_sale) => !_sale.to_integrate
    );
    const salesToNotIntegrate: Entity[] = sales.filter(
      (_sale) => _sale.to_integrate
    );
    await con.setItem(SALE_STORAGE, salesToIntegrate);
    await con.setItem(PRE_INTEGRATED_STORAGE, salesToNotIntegrate);
  }

  async onlineIntegration(): Promise<void> {
    this.is_integrating = true;
    try {
      const con = database.getConnection();
      const sales: Entity[] = (await con.getItem(PRE_INTEGRATED_STORAGE)) || [];

      const salesOnline: Entity[] = sales.filter((_sale) => _sale.is_online);

      const payload = salesFormaterToIntegrate(salesOnline);

      if (payload.length) {
        await midasApi.post("/sales", payload);
      }

      await con.setItem(PRE_INTEGRATED_STORAGE, []);

      const integratedSales: Entity[] =
        (await con.getItem(INTEGRATED_STORAGE)) || [];
      integratedSales.push(...salesOnline);
      await con.setItem(INTEGRATED_STORAGE, integratedSales);
    } catch (error) {
      console.log(error);
    }
    this.is_integrating = false;
  }
}

export default new Integration();
