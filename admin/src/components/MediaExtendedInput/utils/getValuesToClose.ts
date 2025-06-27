import { FlattenedNode } from './flattenTree';

export const getValuesToClose = <T = string | number | null>(
  options: FlattenedNode<T>[],
  value: T
): T[] => {
  // Find all children of the given value
  const valuesToClose: T[] = [value];
  const stack = [value];

  while (stack.length > 0) {
    const currentValue = stack.pop();
    const children = options.filter(option => option.parent === currentValue);
    
    children.forEach(child => {
      valuesToClose.push(child.value);
      stack.push(child.value);
    });
  }

  return valuesToClose;
};