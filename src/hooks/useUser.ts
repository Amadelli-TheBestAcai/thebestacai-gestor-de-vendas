import { useContextSelector } from "use-context-selector";
import { GlobalContext } from "../context/globalContext";

export function useUser() {
  const user = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.user
  );

  return { user };
}
