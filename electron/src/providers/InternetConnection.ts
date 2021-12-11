//@ts-ignore
import fetch from "node-fetch";

export const checkInternet = async (): Promise<boolean> => {
  try {
    await fetch("https://www.google.com");
    return true;
  } catch (err) {
    return false;
  }
};
