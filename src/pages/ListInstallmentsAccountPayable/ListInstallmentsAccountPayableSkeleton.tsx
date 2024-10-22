import {
  ScrollArea,
  Skeleton,
  Table,
} from "@mantine/core";

export const ListInstallmentsAccountPayableSkeleton = () => {
  return (
    <>
      <ScrollArea>
        <Skeleton>
          <Table miw={800} verticalSpacing="sm">
            <Table.Tbody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Skeleton height={20} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={20} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={20} />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={20} />
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Skeleton>
      </ScrollArea>
    </>
  );
};
