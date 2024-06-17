import { useContextSelector } from "use-context-selector";
import { GlobalContext } from "../context/globalContext";

export function useSale() {
  const sale = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.sale
  );
  const setSale = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setSale
  );
  const storeCash = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.storeCash
  );
  const setStoreCash = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setStoreCash
  );
  const loadingSale = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.loading
  );
  const discountModalState = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.discountModalState
  );
  const discountModalHandler = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.discountModalHandler
  );
  const isSavingSale = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.savingSale
  );
  const visibleRemoveTefModal = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.visibleRemoveTefModal
  );
  const setVisibleRemoveTefModal = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setVisibleRemoveTefModal
  );
  const onRegisterSale = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.onRegisterSale
  );
  const onAddItem = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.onAddItem
  );
  const shouldOpenClientInfo = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.shouldOpenClientInfo
  );
  const setShouldOpenClientInfo = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setShouldOpenClientInfo
  );
  const onAddToQueue = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.onAddToQueue
  );
  const onAddDiscount = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.onAddDiscount
  );
  const onRemoveDiscount = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.onRemoveDiscount
  );
  const onDecressItem = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.onDecressItem
  );

  const campaign = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.campaign
  );
  const setCampaign = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setCampaign
  );

  const openedStepSale = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.openedStepSale
  );

  const setOpenedStepSale = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setOpenedStepSale
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
    onRemoveDiscount,
    shouldOpenClientInfo,
    setShouldOpenClientInfo,
    loadingSale,
    isSavingSale,
    onDecressItem,
    onRegisterSale,
    onAddToQueue,
    campaign,
    setCampaign,
    openedStepSale,
    setOpenedStepSale,
    visibleRemoveTefModal,
    setVisibleRemoveTefModal
  };
}
