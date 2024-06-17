import tefApi from "../providers/tefApi";
export async function finalizeServerTef() {
    try {
        await tefApi.post(`/finalize-server-tef`)
    } catch (err) {
        console.error(err);
    }
}