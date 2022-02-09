import { useContextSelector } from "use-context-selector";
import { GlobalContext } from "../context/globalContext";

export function useConfigs() {
  const isInitializing = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.loading
  );

  return { isInitializing };
}
