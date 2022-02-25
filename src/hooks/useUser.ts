import { useContextSelector } from "use-context-selector";
import { GlobalContext } from "../context/globalContext";

export function useUser() {
  const user = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.user
  );
  const setUser = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.setUser
  );

  const hasPermission = useContextSelector(
    GlobalContext,
    (globalContext) => globalContext.hasPermission
  );

  return { user, setUser, hasPermission };
}
