import { useContextSelector } from "use-context-selector";

import { GlobalContext } from "../context/globalContext";

export function useTef() {
  const tefVersionStatus = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.tefVersionStatus
  );

  return { tefVersionStatus };
}
