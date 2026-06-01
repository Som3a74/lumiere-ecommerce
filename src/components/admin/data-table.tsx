import React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No results found.",
}: DataTableProps<T>) {
  return (
    <div className="w-full border border-outline-variant/30 overflow-hidden bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-surface-bright text-on-surface-variant border-b border-outline-variant/30 font-medium tracking-widest">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={cn("px-6 py-4 whitespace-nowrap", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-on-surface-variant">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr 
                  key={keyExtractor(item)} 
                  className={cn(
                    "border-b border-outline-variant/10 hover:bg-surface-variant/20 transition-colors",
                    rowIndex === data.length - 1 && "border-b-0"
                  )}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={cn("px-6 py-4", col.className)}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? (item[col.accessorKey] as React.ReactNode)
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
