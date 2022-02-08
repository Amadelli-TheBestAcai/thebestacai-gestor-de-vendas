import { useContextSelector } from "use-context-selector";
import { SaleContext } from "../context/saleContext";

export function useSettings() {
  const settings = useContextSelector(SaleContext, (sale) => sale.settings);
  const setSettings = useContextSelector(
    SaleContext,
    (sale) => sale.setSettings
  );

  return { settings, setSettings };
}
