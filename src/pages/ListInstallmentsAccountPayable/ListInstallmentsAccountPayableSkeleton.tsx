import {
  Divider,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Table,
} from "@mantine/core";

export const ListInstallmentsAccountPayableSkeleton = () => {
  return (
    <>
      <SimpleGrid cols={{ base: 1, md: 4 }} className="mb-5">
        {/* Skeleton para o card Capital */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Skeleton height={10} width="50%" />
            <Skeleton height={10} width={30} />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Skeleton height={20} width="80%" />
          </Group>
        </Paper>

        {/* Skeleton para o card Taxa */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Skeleton height={10} width="50%" />
            <Skeleton height={10} width={30} />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Skeleton height={20} width="80%" />
          </Group>
        </Paper>

        {/* Skeleton para o card Tempo */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Skeleton height={10} width="50%" />
            <Skeleton height={10} width={30} />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Skeleton height={20} width="80%" />
          </Group>
        </Paper>

        {/* Skeleton para o card Tipo */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Skeleton height={10} width="50%" />
            <Skeleton height={10} width={30} />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Skeleton height={20} width="80%" />
          </Group>
        </Paper>

        {/* Skeleton para o card Juros Totais */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Skeleton height={10} width="50%" />
            <Skeleton height={10} width={30} />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Skeleton height={20} width="80%" />
          </Group>
        </Paper>

        {/* Skeleton para o card Status */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Skeleton height={10} width="50%" />
            <Skeleton height={10} width={30} />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Skeleton height={20} width="80%" />
          </Group>
        </Paper>

        {/* Skeleton para o card Total a Pagar */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Skeleton height={10} width="50%" />
            <Skeleton height={10} width={30} />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Skeleton height={20} width="80%" />
          </Group>
        </Paper>

        {/* Skeleton para o card Parcelas Pagas */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between">
            <Skeleton height={10} width="50%" />
            <Skeleton height={10} width={30} />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Skeleton height={20} width="40%" />
          </Group>
          <Skeleton height={8} mt="md" />
        </Paper>
      </SimpleGrid>
      <Divider h={"md"} />
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
