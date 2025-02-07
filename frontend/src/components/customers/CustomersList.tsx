import { useCallback, useState } from 'react';
import { useCustomers } from '@/hooks/queries/useCustomers';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell,
  Button,
  Card,
  Pagination
} from '@nextui-org/react';
import { formatDate } from '@/lib/utils';
import { CustomerAnalyticsDialog } from './CustomerAnalyticsDialog';

const columns = [
  { key: 'userId', label: 'Kullanıcı ID' },
  { key: 'lastVisit', label: 'Son Ziyaret' },
  { key: 'actions', label: 'İşlemler' },
];

export function CustomersList() {
  const [page, setPage] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const { data, isLoading } = useCustomers({ page });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <Card className="p-4">
        <Table
          aria-label="Müşteri listesi"
          bottomContent={
            data?.pagination && (
              <div className="flex justify-between items-center">
                <span className="text-small text-default-400">
                  Toplam {data.pagination.total} müşteri
                </span>
                <Pagination
                  showControls
                  total={data.pagination.pages}
                  page={page}
                  onChange={handlePageChange}
                />
              </div>
            )
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={data?.customers || []}>
            {(customer) => (
              <TableRow key={customer.userId}>
                <TableCell>{customer.userId}</TableCell>
                <TableCell>{formatDate(customer.lastVisit)}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="light"
                    onPress={() => setSelectedCustomerId(customer.userId)}
                  >
                    Detaylar
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <CustomerAnalyticsDialog
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />
    </>
  );
} 