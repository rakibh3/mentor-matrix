import { Icon } from '@/constants';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';

import type { DataTableProps } from './types';
import { getPageRange } from '@/utils/paginationUtils';

/**
 * DataTable - Reusable data table with pagination and sorting
 *
 * @example
 * <DataTable
 *   data={students}
 *   columns={[
 *     { key: 'name', header: 'Name', accessor: (row) => row.name },
 *     { key: 'email', header: 'Email', accessor: (row) => row.email },
 *   ]}
 *   pagination={{
 *     currentPage: 1,
 *     totalPages: 5,
 *     pageSize: 10,
 *     onPageChange: handlePageChange,
 *   }}
 * />
 */
export function DataTable<T>({
  data,
  columns,
  pagination,
  onSort,
  sortColumn,
  sortDirection,
  actions,
  emptyMessage = 'No data available',
  loading = false,
  headerContent,
}: DataTableProps<T>) {
  const handleSort = (columnKey: string) => {
    if (onSort) {
      onSort(columnKey);
    }
  };

  if (loading) {
    return (
      <Card className="flex items-center justify-center rounded-3xl p-20">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-3xl shadow-2xl">
      {headerContent && (
        <div className="border-card-border bg-card-dark/60 border-b">{headerContent}</div>
      )}
      <TableContainer>
        <Table className="min-w-full border-collapse text-left">
          <TableHeader className="bg-background-dark/30">
            <TableRow className="text-gray-500 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key)}
                      className="group/sort hover:text-primary flex h-auto items-center gap-2 p-0 hover:bg-transparent"
                    >
                      {column.header}
                      {sortColumn === column.key && (
                        <Icon
                          name={sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                          className="text-primary text-sm"
                        />
                      )}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {actions && <TableHead className="text-center">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-card-border/30 divide-y text-sm text-white">
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-12 text-center"
                >
                  <p className="text-text-secondary">{emptyMessage}</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.accessor(row)}
                    </TableCell>
                  ))}
                  {actions && <TableCell className="text-center">{actions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && pagination.totalPages > 1 && (
        <div className="border-card-border bg-card-dark/30 flex flex-col items-center justify-between gap-8 border-t px-12 py-10 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`flex h-auto items-center gap-2 rounded-xl border px-6 py-3 text-xs font-black tracking-[0.2em] uppercase active:scale-95 ${
              pagination.currentPage === 1
                ? 'cursor-not-allowed border-gray-800/30 text-gray-800'
                : 'text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/40'
            }`}
          >
            <Icon name="arrow_back_ios" className="text-sm" /> Previous
          </Button>

          <div className="flex items-center gap-3">
            {getPageRange(pagination.currentPage, pagination.totalPages).map((p, i) =>
              p === '...' ? (
                <span key={`dots-${i}`} className="text-gray-600 px-2 font-black">
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant="ghost"
                  onClick={() => pagination.onPageChange(p as number)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 p-0 text-sm font-black active:scale-90 ${
                    pagination.currentPage === p
                      ? 'bg-primary text-background-dark border-primary hover:bg-primary hover:text-background-dark z-10 scale-110 shadow-lg'
                      : 'text-text-secondary bg-background-dark/40 border-card-border hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {p}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`flex h-auto items-center gap-2 rounded-xl border px-6 py-3 text-xs font-black tracking-[0.2em] uppercase active:scale-95 ${
              pagination.currentPage === pagination.totalPages
                ? 'cursor-not-allowed border-gray-800/30 text-gray-800'
                : 'text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/40'
            }`}
          >
            Next <Icon name="arrow_forward_ios" className="text-sm" />
          </Button>
        </div>
      )}
    </Card>
  );
}

DataTable.displayName = 'DataTable';
