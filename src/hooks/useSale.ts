import { useContextSelector } from "use-context-selector";
import { SaleContext } from "../context/saleContext";

export function useSale() {
  const sale = useContextSelector(SaleContext, (sale) => sale.sale);
  const setSale = useContextSelector(SaleContext, (sale) => sale.setSale);
  const storeCash = useContextSelector(SaleContext, (sale) => sale.storeCash);
  const setStoreCash = useContextSelector(
    SaleContext,
    (sale) => sale.setStoreCash
  );
  const loadingSale = useContextSelector(SaleContext, (sale) => sale.loading);
  const discountModalState = useContextSelector(
    SaleContext,
    (sale) => sale.discountModalState
  );
  const discountModalHandler = useContextSelector(
    SaleContext,
    (sale) => sale.discountModalHandler
  );
  const isSavingSale = useContextSelector(
    SaleContext,
    (sale) => sale.savingSale
  );
  const onRegisterSale = useContextSelector(
    SaleContext,
    (sale) => sale.onRegisterSale
  );
  const onAddItem = useContextSelector(SaleContext, (sale) => sale.onAddItem);
  const onAddToQueue = useContextSelector(
    SaleContext,
    (sale) => sale.onAddToQueue
  );
  const onAddDiscount = useContextSelector(
    SaleContext,
    (sale) => sale.onAddDiscount
  );
  const onDecressItem = useContextSelector(
    SaleContext,
    (sale) => sale.onDecressItem
  );

  return {
    sale,
    setSale,
    storeCash,
    setStoreCash,
    discountModalState,
    discountModalHandler,
    onAddItem,
    onAddDiscount,
    loadingSale,
    isSavingSale,
    onDecressItem,
    onRegisterSale,
    onAddToQueue,
  };
}
