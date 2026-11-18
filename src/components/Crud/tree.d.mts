import type { CrudRecord } from "./types";

type TreeRow = CrudRecord & { __crudTreeChildren?: TreeRow[] };

export function treeRows(rows: CrudRecord[], parentField: string): TreeRow[];
export function walkTreeRows(rows: TreeRow[]): Generator<TreeRow>;
export function treeSelection(
  rows: TreeRow[],
  selected: ReadonlySet<string>
): Map<string, { checked: boolean; indeterminate: boolean }>;
