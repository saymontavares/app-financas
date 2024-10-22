import { Box, Skeleton, Table } from "@mantine/core";

export const TableListAccountsPayableSkeleton = () => {
  return (
    <Box p="md">
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              {Array.from({ length: 5 }).map((_, index) => (
                <Table.Th key={index}>
                  <Skeleton height={10} radius="sm" />
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <Table.Tr key={rowIndex}>
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <Table.Td key={colIndex}>
                    <Skeleton height={8} radius="sm" />
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
};
