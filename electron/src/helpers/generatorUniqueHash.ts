export const generateUniqueHex = (length: number): string => {
  var result = "";
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
