export function clearDuplicatedValues(array: any[], key: string) {
  const list = new Set();
  const cleanedArray: any[] = [];

  for (const object of array) {
    if (!list.has(object[key])) {
      list.add(object[key]);
      cleanedArray.push(object);
    }
  }

  return cleanedArray;
}
