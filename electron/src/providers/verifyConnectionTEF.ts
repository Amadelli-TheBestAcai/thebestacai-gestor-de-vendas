//@ts-ignore
import fetch from "node-fetch";

export const verifyConnectionTEF = async (): Promise<boolean> => {
    try {
        await fetch("http://localhost:7788/healthz");
        return true;
    } catch (err) {
        return false;
    }
};
