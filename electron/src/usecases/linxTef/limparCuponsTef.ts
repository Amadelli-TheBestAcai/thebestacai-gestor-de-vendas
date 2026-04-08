import tefApi from "../../providers/tefApi";

export async function limparCuponsTef(): Promise<void> {
  try {
    await tefApi.delete("/limpa-cupons-tef");
  } catch {
  }
}
