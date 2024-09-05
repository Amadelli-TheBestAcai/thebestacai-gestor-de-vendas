export const validaCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sumFirstDigit = 0;
  for (let i = 0; i < 9; i++) {
    sumFirstDigit += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let rest = (sumFirstDigit * 10) % 11;
  if (rest === 10 || rest === 11) {
    rest = 0;
  }
  if (rest !== parseInt(cpf.charAt(9))) {
    return false;
  }

  let sumSecondDigit = 0;
  for (let j = 0; j < 10; j++) {
    sumSecondDigit += parseInt(cpf.charAt(j)) * (11 - j);
  }
  rest = (sumSecondDigit * 10) % 11;
  if (rest === 10 || rest === 11) {
    rest = 0;
  }
  if (rest !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
};
