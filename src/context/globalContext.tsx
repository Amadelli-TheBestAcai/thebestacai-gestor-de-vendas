import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { createContext } from "use-context-selector";

import { notification } from "antd";

import { SaleDto } from "../models/dtos/sale";
import { SalesTypes } from "../models/enums/salesTypes";
import { PaymentType } from "../models/enums/paymentType";
import { SettingsDto } from "../models/dtos/settings";
import { StoreCashDto } from "../models/dtos/storeCash";
import { UserDto } from "../models/dtos/user";
import { ProductDto } from "../models/dtos/product";
import { StoreDto } from "../models/dtos/store";

type GlobalContextType = {
  sale: SaleDto;
  setSale: Dispatch<SetStateAction<SaleDto>>;
  settings: SettingsDto;
  setSettings: Dispatch<SetStateAction<SettingsDto>>;
  storeCash: StoreCashDto;
  setStoreCash: Dispatch<SetStateAction<StoreCashDto>>;
  loading: boolean;
  savingSale: boolean;
  discountModalState: boolean;
  onAddItem: (
    product: ProductDto,
    quantity: number,
    price?: number
  ) => Promise<void>;
  onDecressItem: (id: string) => Promise<void>;
  onAddDiscount: (value: number) => Promise<void>;
  onAddToQueue: (name: string) => Promise<void>;
  onRegisterSale: () => Promise<void>;
  discountModalHandler: {
    openDiscoundModal: () => void;
    closeDiscoundModal: () => void;
  };
  user: UserDto | null;
  setUser: Dispatch<SetStateAction<UserDto | null>>;
  store: StoreDto | null;
  setStore: Dispatch<SetStateAction<StoreDto | null>>;
  hasPermission: (permission: string) => Promise<boolean>;
};

export const GlobalContext = createContext<GlobalContextType>(null);

export function GlobalProvider({ children }) {
  const [sale, setSale] = useState<SaleDto>();
  const [storeCash, setStoreCash] = useState<StoreCashDto>();
  const [settings, setSettings] = useState<SettingsDto>();
  const [savingSale, setSavingSale] = useState(false);
  const [loading, setLoading] = useState(true);
  const [discountModalState, setDiscountModalState] = useState(false);
  const [user, setUser] = useState<UserDto | null>(null);
  const [store, setStore] = useState<StoreDto | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const { response: _sale, has_internal_error: errorOnSale } =
        await window.Main.sale.getCurrentSale();
      if (errorOnSale) {
        notification.error({
          message: "Erro ao obter venda atual",
          duration: 5,
        });
        return;
      }

      const {
        response: _registredStore,
        has_internal_error: errorOnRegistrationStore,
      } = await window.Main.store.hasRegistration();

      if (errorOnRegistrationStore) {
        return notification.error({
          message: "Falha ao obter loja registrada",
          duration: 5,
        });
      }
      setStore(_registredStore);

      const { response: _storeCash } = await window.Main.storeCash.getCurrent();

      const { response: _user, has_internal_error: errorOnGetUser } =
        await window.Main.user.getUser();
      if (errorOnGetUser) {
        notification.error({
          message: "Erro ao obter usuário",
          duration: 5,
        });
        return;
      }

      const { response: _settings, has_internal_error: errorOnSettings } =
        await window.Main.settings.getSettings();
      if (errorOnSettings) {
        notification.error({
          message: "Erro ao obter a configuração",
          duration: 5,
        });
        return;
      }
      setSettings(_settings);
      setSale(_sale);
      setUser(_user);
      setStoreCash(_storeCash);
      setLoading(false);
    }
    init();
  }, []);

  const discountModalHandler = {
    openDiscoundModal: () => setDiscountModalState(true),
    closeDiscoundModal: () => setDiscountModalState(false),
  };

  const onAddItem = async (
    product: ProductDto,
    quantity: number,
    price?: number
  ): Promise<void> => {
    price;
    const { response: updatedSale, has_internal_error: errorOnAddItem } =
      await window.Main.sale.addItem(product, quantity, price);
    if (errorOnAddItem) {
      return notification.error({
        message: "Erro ao adicionar um item",
        duration: 5,
      });
    }

    setSale(updatedSale);
  };

  const onDecressItem = async (id: string): Promise<void> => {
    const { response: updatedSale, has_internal_error: errorOnDecressItem } =
      await window.Main.sale.decressItem(id);
    if (errorOnDecressItem) {
      return notification.error({
        message: "Erro ao remover item",
        duration: 5,
      });
    }

    notification.success({
      message: "Item removido com sucesso!",
      description: `O item selecionado foi retirado do carrinho.`,
      duration: 3,
    });
    setSale(updatedSale);
  };

  const onRegisterSale = async (): Promise<void> => {
    if (savingSale) {
      return;
    }

    if (!sale.items.length) {
      notification.warning({
        message: "Oops! Carrinho vazio.",
        description: `Nenhum item selecionado para venda, selecione algum item
                      ao carrinho para que seja possível finalizá-la.`,
        duration: 5,
      });
    }

    if (sale.items.length) {
      if (
        +(sale.total_sold.toFixed(2) || 0) >
        sale.total_paid + (sale.discount || 0) + 0.5
      ) {
        return notification.warning({
          message: "Pagamento inválido!",
          description: `Nenhuma forma de pagamento selecionado ou valor incorreto para pagamento.`,
          duration: 5,
        });
      }

      setSavingSale(true);
      const { has_internal_error: errorOnFinishSAle } =
        await window.Main.sale.finishSale({
          ...sale,
          formated_type: SalesTypes[sale.type],
        });
      if (errorOnFinishSAle) {
        return notification.error({
          message: "Erro ao finalizar venda",
          duration: 5,
        });
      }

      const { response: _newSale, has_internal_error: errorOnBuildNewSale } =
        await window.Main.sale.buildNewSale();
      if (errorOnBuildNewSale) {
        notification.error({
          message: "Erro ao criar uma venda",
          duration: 5,
        });
        return;
      }

      setSale(_newSale);
      setSavingSale(false);
      notification.success({
        message: "Venda realizada com sucesso!",
        description: `A venda foi registrada com sucesso.`,
        duration: 3,
      });
    }
  };

  const onAddToQueue = async (name: string): Promise<void> => {
    const { response: _newSale, has_internal_error: errorOnCreateStepSale } =
      await window.Main.sale.createStepSale(name);
    if (errorOnCreateStepSale) {
      return notification.error({
        message: "Erro ao salvar comanda",
        duration: 5,
      });
    }

    setSale(_newSale);
    notification.success({
      message: "Comanda salva com sucesso!",
      description: `Para que a venda retorne ao carrinho, clique na ação de restaurar a comanda[🔁] do modal anterior.`,
      duration: 5,
    });
  };

  const onAddDiscount = async (value: number): Promise<void> => {
    if (value > sale.total_sold) {
      return notification.warning({
        message: "Não é possível aplicar este desconto",
        description: `O valor informado é maior que o valor total da venda.`,
        duration: 5,
      });
    }

    const { response: _updatedSale, has_internal_error: errorOnUpdateSale } =
      await window.Main.sale.updateSale(sale.id, {
        ...sale,
        discount: value,
      });
    if (errorOnUpdateSale) {
      return notification.error({
        message: "Erro ao aplicar desconto",
        duration: 5,
      });
    }

    setSale(_updatedSale);
  };

  const hasPermission = async (permission: string): Promise<boolean> => {
    return user
      ? user.permissions.some((_permission) => _permission === permission)
      : false;
  };

  return (
    <GlobalContext.Provider
      value={{
        sale,
        setSale,
        settings,
        setSettings,
        storeCash,
        setStoreCash,
        loading,
        savingSale,
        discountModalState,
        discountModalHandler,
        onAddDiscount,
        onAddItem,
        onDecressItem,
        onRegisterSale,
        onAddToQueue,
        user,
        setUser,
        hasPermission,
        store,
        setStore,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
