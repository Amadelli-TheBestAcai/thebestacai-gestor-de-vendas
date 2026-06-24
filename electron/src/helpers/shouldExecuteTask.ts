import janusApi from "../providers/janusApi";

export async function shouldExecuteTask(task: string): Promise<boolean> {
  try {
    const { data } = await janusApi.get(
      "/files-management/ti/configuracoes/gestor-v2-config-feature-flag.json/beautify"
    );

    if (data == null || !(task in data)) {
      return false;
    }
    return data[task] === true;
  } catch {
    return false;
  }
}
