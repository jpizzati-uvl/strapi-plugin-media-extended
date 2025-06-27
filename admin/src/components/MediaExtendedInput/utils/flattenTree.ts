export interface FlattenedNode<T = string | number | null> {
  value: T;
  label?: string;
  parent?: T;
  children?: TreeNode<T>[];
  depth: number;
}

interface TreeNode<T = string | number | null> {
  value: T;
  label?: string;
  children?: TreeNode<T>[];
}

export const flattenTree = <T = string | number | null>(
  data: TreeNode<T>[],
  parent?: T,
  depth = 0
): FlattenedNode<T>[] => {
  return data.reduce<FlattenedNode<T>[]>((acc, node) => {
    const flatNode: FlattenedNode<T> = {
      value: node.value,
      label: node.label,
      parent,
      depth,
    };

    if (node.children && node.children.length > 0) {
      flatNode.children = node.children;
      return [...acc, flatNode, ...flattenTree(node.children, node.value, depth + 1)];
    }

    return [...acc, flatNode];
  }, []);
};