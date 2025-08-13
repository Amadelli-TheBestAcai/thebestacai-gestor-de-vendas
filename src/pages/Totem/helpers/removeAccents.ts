export const removeAccents = (string: string) => {
  if(!string) null;

  return string?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
