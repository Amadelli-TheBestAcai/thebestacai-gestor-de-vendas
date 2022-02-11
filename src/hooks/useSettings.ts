import { useContextSelector } from "use-context-selector";
import { GlobalContext } from "../context/globalContext";

export function useSettings() {
  const settings = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.settings
  );
  const setSettings = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setSettings
  );

  return { settings, setSettings };
}
