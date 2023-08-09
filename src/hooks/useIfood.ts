import { useContextSelector } from "use-context-selector";
import { GlobalContext } from "../context/globalContext";

export function useIfood() {
  const ifood = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.ifood
  );
  const setIfood = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setIfood
  );

  const togleIfoodPooling = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.togleIfoodPooling
  );

  return { ifood, setIfood, togleIfoodPooling };
}
