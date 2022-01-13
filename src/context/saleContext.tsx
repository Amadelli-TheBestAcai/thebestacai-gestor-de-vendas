import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { createContext } from "use-context-selector";

import { message } from "antd";

import { SaleDto } from "../models/dtos/sale";
import { UserDto } from "../models/dtos/user";
import { ProductDto } from "../models/dtos/product";

type SaleContextType = {
  sale: SaleDto;
  setSale: Dispatch<SetStateAction<SaleDto>>;
  loading: boolean;
  savingSale: boolean;
  discountModalState: boolean;
  onAddItem: (product: ProductDto, quantity: number) => Promise<void>;
  onDecressItem: (id: string) => Promise<void>;
  onAddDiscount: (value: number) => Promise<void>;
  onAddToQueue: (name: string) => Promise<void>;
  onRegisterSale: () => Promise<void>;
  discountModalHandler: {
    openDiscoundModal: () => void;
    closeDiscoundModal: () => void;
  };
  user: UserDto | null;
};

export const SaleContext = createContext<SaleContextType>(null);

export function SaleProvider({ children }) {
  const [sale, setSale] = useState<SaleDto>();
  const [savingSale, setSavingSale] = useState(false);
  const [loading, setLoading] = useState(true);
  const [discountModalState, setDiscountModalState] = useState(false);
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const _sale = await window.Main.sale.getCurrent();
      const _user = await window.Main.user.getUser();
      setSale(_sale);
      setUser(_user);
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
    quantity: number
  ): Promise<void> => {
    const updatedSale = await window.Main.sale.addItem(product, quantity);
    setSale(updatedSale);
  };

  const onDecressItem = async (id: string): Promise<void> => {
    const updatedSale = await window.Main.sale.decressItem(id);
    setSale(updatedSale);
  };

  const onRegisterSale = async (): Promise<void> => {
    if (savingSale) {
      return;
    }

    if (!sale.items.length) {
      return message.warning("Nenhum item cadastrado para a venda");
    }

    if (
      +(sale.total_sold.toFixed(2) || 0) >
      sale.total_paid + (sale.discount || 0) + 0.5
    ) {
      return message.warning("Pagamento inválido");
    }

    setSavingSale(true);
    const _newSale = await window.Main.sale.finishSale();
    setSale(_newSale);
    setSavingSale(false);
  };

  const onAddToQueue = async (name: string): Promise<void> => {
    console.log(name);
  };

  const removePayment = async (id: string): Promise<void> => {
    const updatedSale = await window.Main.sale.deletePayment(id);
    setSale(updatedSale);
  };

  const onAddDiscount = async (value: number): Promise<void> => {
    if (value > sale.total_sold) {
      message.warning("Desconto maior que o valor da venda.");
      return;
    }
    // const _updatedSale = await window.Main.sale.update(sale.id, {
    //   ...sale,
    //   discount: +value,
    // });
    // setSale(_updatedSale);
  };

  return (
    <SaleContext.Provider
      value={{
        sale,
        setSale,
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
      }}
    >
      {children}
    </SaleContext.Provider>
  );
}
