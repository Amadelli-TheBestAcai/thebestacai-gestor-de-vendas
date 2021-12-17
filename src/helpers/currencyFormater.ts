export const currencyFormater = (amount: number | undefined): string => {
  return (amount || 0)
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
