import { Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/components/ui';


import { Icon } from '@/constants';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { DataTableProps } from './types';

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
      <Card className="rounded-3xl p-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl shadow-2xl overflow-hidden">
      {headerContent && (
        <div className="border-b border-card-border bg-card-dark/60">
          {headerContent}
        </div>
      )}
      <TableContainer>
        <Table className="text-left border-collapse min-w-full">
          <TableHeader className="bg-background-dark/30">
            <TableRow className="text-gray-500 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key)}
                      className="group/sort flex items-center gap-2 hover:text-primary h-auto p-0 hover:bg-transparent"
                    >
                      {column.header}
                      {sortColumn === column.key && (
                        <Icon
                          name={sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                          className="text-sm text-primary"
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
          <TableBody className="divide-y divide-card-border/30 text-sm text-white">
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-12">
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
                  {actions && (
                    <TableCell className="text-center">
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && pagination.totalPages > 1 && (
        <div className="px-12 py-10 border-t border-card-border bg-card-dark/30 flex flex-col sm:flex-row items-center justify-between gap-8">
          <Button
            variant="outline"
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`flex items-center gap-2 px-6 py-3 h-auto rounded-xl text-xs font-black uppercase tracking-[0.2em] border active:scale-95 ${
              pagination.currentPage === 1
                ? 'text-gray-800 border-gray-800/30 cursor-not-allowed'
                : 'text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/40'
            }`}
          >
            <Icon name="arrow_back_ios" className="text-sm" /> Previous
          </Button>

          <div className="flex items-center gap-3">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant="ghost"
                onClick={() => pagination.onPageChange(p)}
                className={`w-12 h-12 p-0 rounded-xl flex items-center justify-center text-sm font-black active:scale-90 border-2 ${
                  pagination.currentPage === p
                    ? 'bg-primary text-background-dark border-primary shadow-lg scale-110 z-10 hover:bg-primary hover:text-background-dark'
                    : 'text-text-secondary bg-background-dark/40 border-card-border hover:bg-white/5 hover:text-white'
                }`}
              >
                {p}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`flex items-center gap-2 px-6 py-3 h-auto rounded-xl text-xs font-black uppercase tracking-[0.2em] border active:scale-95 ${
              pagination.currentPage === pagination.totalPages
                ? 'text-gray-800 border-gray-800/30 cursor-not-allowed'
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
