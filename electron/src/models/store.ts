import { BaseRepository } from "../repository/baseRepository";
import { checkInternet } from "../providers/internetConnection";
import janusApi from "../providers/janusApi";
import user from "../models/user";

type Entity = {
  id: number;
  user_id: number;
  company_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  company: {
    id: number;
    cnpj: string;
    emitente_uf: string;
    emitente_incentivo_fiscal: boolean;
    token_nfce_production_id: number;
    state_registration: string;
    company_name: string;
    emitente_razao_social: string;
    emitente_nome_fantasia: string;
    emitente_inscricao_estadual: string;
    emitente_isento: boolean;
    emitente_inscricao_municipal: number;
    emitente_cnae: string;
    emitente_regime_tributario: number;
    city: string;
    address: string;
    number: string;
    cep: string;
    occupation_area: string;
    franchisee_fee: number;
    royalts: number;
    marketing: number;
    software: number;
    contract_start: Date;
    contract_time: number;
    email: string;
    telefone: string;
    distance: number;
    selected_group: boolean;
    crt: string;
    complement: string;
    district: string;
    password_certificate: string;
    certificate_url: string;
    certificate_key: string;
    token_ibpt: string;
    password: string;
    city_id: string;
    number_nfe: string;
    serie_nfe: string;
    token_nfce_production: string;
    merchant_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
  };
};

class Store extends BaseRepository<Entity> {
  registratedStore: Entity | null = null;
  constructor(storageName = "Store") {
    super(storageName);
  }

  async hasRegistration(): Promise<Entity | undefined> {
    const store = await this.getOne();
    if (!store) {
      return undefined;
    }
    this.registratedStore = store;
    return store;
  }

  async getFromApi(): Promise<Entity[]> {
    const hasInternet = await checkInternet();
    if (!hasInternet) {
      return [];
    }

    const {
      data: { content },
    } = await janusApi.get(`/companyUser/${user.loggedUser?.id}/user`);

    return content;
  }
}

export default new Store();
