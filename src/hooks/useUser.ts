import { useContextSelector } from "use-context-selector";
import { SaleContext } from "../context/saleContext";

export function useUser() {
  const user = useContextSelector(SaleContext, (sale) => sale.user);

  return { user };
}
