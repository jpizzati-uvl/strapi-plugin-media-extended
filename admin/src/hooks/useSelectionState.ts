import * as React from 'react';

type SelectionValue = { [key: string]: any };

export const useSelectionState = <TValue extends SelectionValue>(
  keys: string[],
  initialValue: TValue[] = []
): [
  TValue[],
  {
    selectOne: (selection: TValue) => void;
    selectAll: (nextSelections: TValue[]) => void;
    selectOnly: (nextSelection: TValue) => void;
    selectMultiple: (nextSelections: TValue[]) => void;
    deselectMultiple: (nextSelections: TValue[]) => void;
    deselectAll: () => void;
    setSelections: (nextSelections: TValue[]) => void;
  }
] => {
  const [selections, setSelections] = React.useState<TValue[]>(initialValue);

  const selectOne = React.useCallback((nextSelection: TValue) => {
    setSelections((prevSelected) =>
      prevSelected.findIndex((prevSelectedItem) =>
        keys.every((key) => prevSelectedItem[key] === nextSelection[key])
      ) >= 0
        ? prevSelected.filter(
            (prevSelectedItem) => !keys.every((key) => prevSelectedItem[key] === nextSelection[key])
          )
        : [...prevSelected, nextSelection]
    );
  }, [keys]);

  const selectAll = React.useCallback((nextSelections: TValue[]) => {
    setSelections((prevSelected) => [
      ...nextSelections,
      ...prevSelected.filter(
        (prevSelectedItem) =>
          !nextSelections.find((nextSelectedItem) =>
            keys.every((key) => prevSelectedItem[key] === nextSelectedItem[key])
          )
      ),
    ]);
  }, [keys]);

  const deselectAll = React.useCallback(() => {
    setSelections([]);
  }, []);

  const selectOnly = React.useCallback((nextSelection: TValue) => {
    setSelections([nextSelection]);
  }, []);

  const selectMultiple = React.useCallback((nextSelections: TValue[]) => {
    setSelections((prevSelected) => [
      ...prevSelected,
      ...nextSelections.filter(
        (nextSelectedItem) =>
          !prevSelected.find((prevSelectedItem) =>
            keys.every((key) => prevSelectedItem[key] === nextSelectedItem[key])
          )
      ),
    ]);
  }, [keys]);

  const deselectMultiple = React.useCallback((nextSelections: TValue[]) => {
    setSelections((prevSelected) =>
      prevSelected.filter(
        (prevSelectedItem) =>
          !nextSelections.find((nextSelectedItem) =>
            keys.every((key) => prevSelectedItem[key] === nextSelectedItem[key])
          )
      )
    );
  }, [keys]);

  return [
    selections,
    {
      selectOne,
      selectAll,
      selectOnly,
      selectMultiple,
      deselectMultiple,
      deselectAll,
      setSelections,
    },
  ];
};