export const replaceSpecialChars = (string: string): string => {
  if (!string) {
    return ''
  }
  return string
    .replace(/[ÁÀÃ]/g, 'A')
    .replace(/[áàã]/g, 'a')
    .replace(/[ÈÉ]/g, 'E')
    .replace(/[éè]/g, 'e')
    .replace(/[ÍÌ]/g, 'I')
    .replace(/[íì]/g, 'i')
    .replace(/[ÓÒ]/g, 'O')
    .replace(/[óò]/g, 'o')
    .replace(/[ÚÙ]/g, 'U')
    .replace(/[úù]/g, 'u')
    .replace(/[Ç]/g, 'C')
    .replace(/[ç]/g, 'c')
}
