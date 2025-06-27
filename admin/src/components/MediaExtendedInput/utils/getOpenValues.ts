import { FlattenedNode } from './flattenTree';

export const getOpenValues = <T = string | number | null>(
  options: FlattenedNode<T>[],
  value?: { value?: T } | null
): T[] => {
  if (!value?.value) {
    return [];
  }

  const selectedOption = options.find(option => option.value === value.value);
  
  if (!selectedOption) {
    return [];
  }

  const openValues: T[] = [];
  let current: FlattenedNode<T> | undefined = selectedOption;

  // Walk up the tree to find all parent values
  while (current?.parent !== undefined) {
    const parent = options.find(option => option.value === current!.parent);
    if (parent) {
      openValues.unshift(parent.value);
      current = parent;
    } else {
      break;
    }
  }

  return openValues;
};