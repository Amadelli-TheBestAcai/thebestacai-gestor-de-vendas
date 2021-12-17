export const onlyNumbers = (value: any): number | null => {
  if (!value) {
    return null
  }
  return +value.replace(/[^0-9]/g, '')
}
