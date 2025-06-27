export const moveElement = <T>(array: T[], index: number, offset: number): T[] => {
  const newIndex = index + offset;

  if (newIndex < 0 || newIndex >= array.length) {
    return array;
  }

  const item = array[index];
  const newArray = [...array];
  newArray.splice(index, 1);
  newArray.splice(newIndex, 0, item);

  return newArray;
};