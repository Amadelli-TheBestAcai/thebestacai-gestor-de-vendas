import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { createContext } from "use-context-selector";

import { notification } from "antd";

import { SaleDto } from "../models/dtos/sale";
import { SalesTypes } from "../models/enums/salesTypes";
import { SettingsDto } from "../models/dtos/settings";
import { StoreCashDto } from "../models/dtos/storeCash";
import { UserDto } from "../models/dtos/user";
import { StoreProductDto } from "../models/dtos/storeProduct";
import { StoreDto } from "../models/dtos/store";
import { CampaignDto } from "../models/dtos/campaign";
import { CashHandlerDTO } from "../../electron/src/models/dtos";

type GlobalContextType = {
  sale: SaleDto;
  setSale: Dispatch<SetStateAction<SaleDto>>;
  settings: SettingsDto;
  setSettings: Dispatch<SetStateAction<SettingsDto>>;
  storeCash: StoreCashDto;
  setStoreCash: Dispatch<SetStateAction<StoreCashDto>>;
  loading: boolean;
  savingSale: boolean;
  onAddItem: (
    product: StoreProductDto,
    quantity: number,
    price?: number
  ) => Promise<void>;
  onDecressItem: (id: string) => Promise<void>;
  onAddDiscount: (value: number) => Promise<void>;
  onRemoveDiscount: (id: string) => Promise<void>;
  onAddToQueue: (name: string) => Promise<void>;
  onRegisterSale: () => Promise<void>;
  discountModalState: boolean;
  discountModalHandler: {
    openDiscoundModal: () => void;
    closeDiscoundModal: () => void;
  };
  shouldOpenClientInfo: boolean;
  setShouldOpenClientInfo: Dispatch<SetStateAction<boolean>>;
  visibleRemoveTefModal: boolean;
  setVisibleRemoveTefModal: Dispatch<SetStateAction<boolean>>;
  cupomModalState: boolean;
  setCupomModalState: Dispatch<SetStateAction<boolean>>;
  user: UserDto | null;
  setUser: Dispatch<SetStateAction<UserDto | null>>;
  store: StoreDto | null;
  setStore: Dispatch<SetStateAction<StoreDto | null>>;
  campaign: CampaignDto | null;
  setCampaign: Dispatch<SetStateAction<CampaignDto | null>>;
  openedStepSale: number;
  setOpenedStepSale: Dispatch<SetStateAction<number>>;
  hasPermission: (_permission: string) => boolean;
};

export const GlobalContext = createContext<GlobalContextType>(null);

export function GlobalProvider({ children }) {
  const [sale, setSale] = useState<SaleDto>();
  const [storeCash, setStoreCash] = useState<StoreCashDto>();
  const [settings, setSettings] = useState<SettingsDto>();
  const [savingSale, setSavingSale] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cupomModalState, setCupomModalState] = useState(false);
  const [discountModalState, setDiscountModalState] = useState(false);
  const [visibleRemoveTefModal, setVisibleRemoveTefModal] = useState(false);
  const [user, setUser] = useState<UserDto | null>(null);
  const [store, setStore] = useState<StoreDto | null>(null);
  const [shouldOpenClientInfo, setShouldOpenClientInfo] = useState(false);
  const [campaign, setCampaign] = useState<CampaignDto | null>(null);
  const [openedStepSale, setOpenedStepSale] = useState(0);
  const [cashHandler, setCashHandler] = useState<CashHandlerDTO | null>(null);

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

      const { response: stepSales } = await window.Main.sale.getAllStepSales();

      setOpenedStepSale(stepSales.filter((sale) => sale.enabled).length);
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
    product: StoreProductDto,
    quantity: number,
    price?: number
  ): Promise<void> => {
    if (sale.customerVoucher) {
      return notification.error({
        message: "Remova o cupom antes de adicionar o item ao carrinho",
        duration: 5,
      });
    }
    const {
      response: updatedSale,
      has_internal_error: errorOnAddItem,
      error_message,
    } = await window.Main.sale.addItem(product, quantity, price);
    if (errorOnAddItem) {
      return notification.error({
        message: "Erro ao adicionar um item",
        duration: 5,
      });
    }

    setSale(updatedSale);
    if (updatedSale.items.length === 1 && !sale.client_cpf) {
      setShouldOpenClientInfo(true);
    } else {
      setShouldOpenClientInfo(false);
    }
    document.getElementById("balanceInput")?.focus();
  };

  const onDecressItem = async (id: string): Promise<void> => {
    if (sale.customerVoucher) {
      return notification.error({
        message: "Remova o cupom antes de retirar o item do carrinho",
        duration: 5,
      });
    }
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
    document.getElementById("balanceInput")?.focus();
  };

  const onRegisterSale = async (): Promise<void> => {
    if (savingSale) {
      return;
    }

    const hasInternet = await window.Main.hasInternet();

    const { response: currentSale } = await window.Main.sale.getCurrentSale();

    if (
      !currentSale.items.length &&
      !currentSale?.customerVoucher?.voucher?.products?.length
    ) {
      notification.warning({
        message: "Oops! Carrinho vazio.",
        description: `Nenhum item selecionado para venda, selecione algum item
                      ao carrinho para que seja possível finalizá-la.`,
        duration: 5,
      });
      return;
    }

    if (
      +(currentSale.total_sold.toFixed(2) || 0) >
      currentSale.total_paid +
        ((currentSale.discount || 0) +
          (currentSale.customer_nps_reward_discount || 0)) +
        0.5
    ) {
      return notification.warning({
        message: "Pagamento inválido!",
        description: `Nenhuma forma de pagamento selecionado ou valor incorreto para pagamento.`,
        duration: 5,
      });
    }

    currentSale.change_amount = +(
      currentSale.total_paid +
      currentSale.discount -
      currentSale.total_sold
    ).toFixed(2);

    setSavingSale(true);

    const codes_nsu = currentSale.payments
      .map((payment) => payment.code_nsu)
      .filter((code_nsu) => code_nsu !== undefined && code_nsu !== null);

    if (codes_nsu.length > 0) {

      if (!hasInternet) {
        setSavingSale(false);
        setVisibleRemoveTefModal(true);
        return;
      }
      
      const { has_internal_error: errorOnFinalizaTransacao, error_message } =
        await window.Main.tefFactory.finalizeTransaction(codes_nsu);

      if (errorOnFinalizaTransacao) {
        notification.error({
          message: error_message || "Erro ao finalizar transação TEF",
          duration: 5,
        });
        setSavingSale(false);
        return;
      }
    }

    if (
      (currentSale.items.length && settings.should_emit_nfce_per_sale) ||
      (currentSale.items.length && currentSale.cpf_used_nfce)
    ) {
      const total = currentSale.items.reduce(
        (total, item) => +item.total + total,
        0
      );
      const nfePayload = {
        cpf: currentSale?.cpf_used_nfce ? currentSale?.client_cpf : null,
        discount: +currentSale.discount,
        change_amount: +currentSale.change_amount,
        total: total,
        store_id: +store.company_id,
        items: currentSale.items.map((item) => ({
          product_store_id: +item.store_product_id,
          price_sell: +item.total,
          quantity: +item.quantity,
        })),
        payments: currentSale.payments.map((payment) => ({
          amount: +payment.amount.toFixed(2),
          type: +payment.type,
          flag_card: +payment.flag_card,
          code_nsu: payment.code_nsu ? payment.code_nsu : null,
          cnpj_credenciadora: payment.code_nsu
            ? payment.cnpj_credenciadora
            : null,
          numero_autorizacao: payment.code_nsu
            ? payment.numero_autorizacao
            : null,
        })),
        ref: currentSale.ref,
      };

      const {
        response,
        has_internal_error: errorOnEmitNfce,
        error_message,
      } = await window.Main.sale.emitNfce(nfePayload, currentSale.id, true);

      if (errorOnEmitNfce) {
        notification.error({
          message: error_message || "Erro ao emitir NFCe",
          duration: 5,
        });
      }

      const successOnSefaz = response?.status_sefaz === "100";
      notification[successOnSefaz ? "success" : "warning"]({
        message: response?.mensagem_sefaz,
        duration: 5,
      });

      if (successOnSefaz && settings.should_print_nfce_per_sale) {
        const { response: _printDanfe, has_internal_error: errorOnDanfe } =
          await window.Main.common.printDanfe(response);

        // @ts-ignore
        if (!_printDanfe) {
          notification.warning({
            message: "Não foi possível concluir a impressão da NFC-e.",
            description: `Por favor, verifique a conexão da sua impressora.
            Após isso tente emitir novamente pela tela de vendas.`,
            duration: 5,
          });
        }

        if (errorOnDanfe) {
          notification.error({
            message: "Erro ao tentar imprimir",
            duration: 5,
          });
        }
      }

      const { response: updatedSale } = await window.Main.sale.getCurrentSale();
      currentSale.nfce_focus_id = updatedSale.nfce_focus_id;
      currentSale.nfce_url = updatedSale.nfce_url;
    }

    const { has_internal_error: errorOnFinishSAle, error_message } =
      await window.Main.sale.finishSale({
        ...currentSale,
        formated_type: SalesTypes[currentSale.type],
      });

    if (errorOnFinishSAle) {
      if (
        settings.should_open_casher === true &&
        error_message ===
          "Nenhum caixa está disponível para abertura, entre em contato com o suporte"
      ) {
        const { response: _newSettings, has_internal_error: errorOnSettings } =
          await window.Main.settings.update(settings.id, {
            ...settings,
            should_open_casher: false,
          });

        if (errorOnSettings) {
          notification.error({
            message: "Erro ao atualizar as configurações",
            duration: 5,
          });
          return;
        }
        setSettings(_newSettings);
      }
      setSavingSale(false);

      error_message
        ? notification.warning({
            message: error_message,
            duration: 5,
          })
        : notification.error({
            message: "Erro ao finalizar venda",
            duration: 5,
          });
    }

    const { response: cashHandlers } =
      await window.Main.handler.getLocalCashHandlers();

    const cashHandlerObjects = cashHandlers
      .filter((handler) => handler.cashHandler.type === "saida")
      .reduce((acc, handler) => acc + handler.cashHandler.amount, 0);

    const { response: _balance } =
      await window.Main.storeCash.getStoreCashBalance();

    const paymentMoneyType = sale?.payments
      ?.map((payment) => payment)
      .find((moneyItem) => moneyItem.type === 0);
    const totalStore = _balance?.store?.money - cashHandlerObjects;

    if (paymentMoneyType && totalStore > 500) {
      notification.warning({
        message:
          "ATENÇÃO: O saldo em dinheiro no caixa está elevado. Considere fazer uma sangria",
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

    if (settings.should_print_sale && settings.should_use_printer) {
      //@ts-expect-error
      window.Main.common.printSale(currentSale);
    }

    document.getElementById("balanceInput")?.focus();
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
      description: `Para que a venda retorne ao carrinho, clique na ação de restaurar a comanda[🔁] no menu de comandas.`,
      duration: 5,
    });

    document.getElementById("balanceInput")?.focus();
  };

  const onAddDiscount = async (value: number): Promise<void> => {
    if (!sale.items.length) {
      return notification.warning({
        message: "Não é possível aplicar este desconto",
        description: `Adicione produtos para aplicar desconto`,
        duration: 5,
      });
    }

    const total_paid = sale.payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    if (value > sale.total_sold) {
      return notification.warning({
        message: "Não é possível aplicar este desconto",
        description: `Desconto não deve ser maior que o valor total dos produtos.`,
        duration: 5,
      });
    }

    if (
      sale.total_sold === total_paid ||
      value > sale.total_sold - total_paid
    ) {
      return notification.warning({
        message: "Não é possível aplicar este desconto",
        description: `Retire todos os pagamentos para adicionar desconto.`,
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
    document.getElementById("balanceInput")?.focus();
  };

  const onRemoveDiscount = async (id: string): Promise<void> => {
    const { response: updatedSale, has_internal_error: errorOnDiscount } =
      await window.Main.sale.updateSale(id, {
        ...sale,
        discount: 0,
      });
    if (errorOnDiscount) {
      return notification.error({
        message: "Erro ao remover desconto",
        duration: 5,
      });
    }

    notification.success({
      message: "Desconto removido com sucesso!",
      description: `O desconto selecionado foi retirado.`,
      duration: 3,
    });
    setSale(updatedSale);
  };

  const hasPermission = (_permission: string): boolean => {
    return user.permissions?.some((permission) => permission === _permission);
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
        visibleRemoveTefModal,
        setVisibleRemoveTefModal,
        discountModalState,
        discountModalHandler,
        onAddDiscount,
        onRemoveDiscount,
        onAddItem,
        onDecressItem,
        onRegisterSale,
        onAddToQueue,
        user,
        setUser,
        hasPermission,
        store,
        setStore,
        cupomModalState,
        setCupomModalState,
        shouldOpenClientInfo,
        setShouldOpenClientInfo,
        campaign,
        setCampaign,
        openedStepSale,
        setOpenedStepSale,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
