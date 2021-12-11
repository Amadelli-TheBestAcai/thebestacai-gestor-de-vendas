import axios from "axios";

export const checkInternet = async (): Promise<boolean> => {
  try {
    await axios({
      url: "https://www.google.com",
    });
    return true;
  } catch (err) {
    return false;
  }
};
