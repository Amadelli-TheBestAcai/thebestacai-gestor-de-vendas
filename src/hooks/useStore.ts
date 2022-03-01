import { useContextSelector } from "use-context-selector";
import { GlobalContext } from "../context/globalContext";

export function useStore() {
  const store = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.store
  );
  const setStore = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setStore
  );

  return { store, setStore };
}
