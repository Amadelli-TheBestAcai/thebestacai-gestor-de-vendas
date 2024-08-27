export const applyCPFMask = (numbers, showCPF) => {
  const onlyNumbers = numbers?.replace(/\D/g, "");

  if (!onlyNumbers || onlyNumbers?.length === 0) {
    return "";
  }

  let formattedCPF = onlyNumbers;

  if (onlyNumbers.length > 3) {
    formattedCPF = formattedCPF.slice(0, 3) + "." + formattedCPF.slice(3);
  }
  if (onlyNumbers.length > 6) {
    formattedCPF = formattedCPF.slice(0, 7) + "." + formattedCPF.slice(7);
  }
  if (onlyNumbers.length > 9) {
    formattedCPF = formattedCPF.slice(0, 11) + "-" + formattedCPF.slice(11);
  }

  if (showCPF) {
    return formattedCPF;
  }
  const hiddenString = formattedCPF.replace(/\d/g, "*");
  return hiddenString;
};
