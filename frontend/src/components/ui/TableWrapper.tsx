import { ReactNode } from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

interface TableWrapperProps {
  children: ReactNode;
  "aria-label": string;
}

export const TableWrapper = ({ children, ...props }: TableWrapperProps) => {
  return (
    <Table {...props}>
      {children}
    </Table>
  );
};

export const TableBodyWrapper = ({ children }: { children: ReactNode | undefined }) => {
  if (!children) return null;
  
  return (
    <TableBody>
      {children}
    </TableBody>
  );
}; 