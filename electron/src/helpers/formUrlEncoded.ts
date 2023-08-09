export const formUrlEncoded = (x): any =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "");
