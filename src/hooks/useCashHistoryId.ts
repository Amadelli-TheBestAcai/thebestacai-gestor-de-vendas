import { useContextSelector } from "use-context-selector";
import { GlobalContext } from "../context/globalContext";

export function useCashHistoryId() {
  const cashHistoryId = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.storeCash
  );
  const setCashHistoryId = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setStoreCash
  );

  return { cashHistoryId, setCashHistoryId };
}
